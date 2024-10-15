import { useEffect, useState } from "react";
import { Harbor } from "../types/Harbor";
import { BlockData, ChartData } from "../types/TidalWater";
import axios from "axios";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./TidalWater.css";
import { TidalWater } from "../types/TidalWater";

const TidalWaterPage = ({ setError, setLoading, loading, apiUrl }: any) => {
  const [harbors, setHarbors] = useState<Harbor[]>([]);
  const [data, setData] = useState<ChartData[]>([]);

  const [blocks, setBlocks] = useState<BlockData[]>([]);

  const fetchHarbors = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tidalwater/harbors`);
      const harbors: Harbor[] = response.data as Harbor[];
      setHarbors(harbors);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHarbors();
    if (!blocks || blocks.length === 0) {
      addBlock(null);
    }
  }, []);

  const colors: string[] = [
    "#64B5F6", // Medium Blue
    "#81C784", // Soft Green
    "#FFB74D", // Soft Orange
    "#E57373", // Light Red
    "#9575CD", // Soft Purple
    "#FFF176", // Soft Yellow
    "#FF8A65", // Soft Coral
    "#4DD0E1", // Soft Cyan
    "#AED581", // Light Lime Green
    "#FFCC80", // Light Apricot
    "#7986CB", // Medium Indigo
    "#BA68C8", // Soft Violet
    "#90CAF9", // Light Sky Blue
    "#F06292", // Soft Pink
    "#FFD54F", // Soft Golden
    "#A1887F", // Soft Brown
    "#4FC3F7", // Light Aqua
    "#F48FB1", // Light Pink
    "#CE93D8", // Light Lavender
    "#FFAB91", // Light Coral Orange
  ];

  const mergeData = (lines: Array<{ time: string; level: number }[]>) => {
    const mergedData: Record<string, any> = {};

    lines.forEach((line, index) => {
      line.forEach(({ time, level }) => {
        if (!mergedData[time]) {
          mergedData[time] = { time };
        }
        mergedData[time][`level_${index}`] = level;
      });
    });

    return Object.values(mergedData);
  };

  const renderLineChart = (
    <div className="chart">
      <LineChart
        width={1200}
        height={700}
        margin={{ top: 5, right: 20, bottom: 90, left: 20 }}
        data={mergeData(blocks?.map((block) => block.data) ?? [])}
      >
        {blocks &&
          blocks.map((block) => {
            return (
              <Line
                type="monotone"
                stroke={colors[parseInt(block.id) % colors.length]}
                dataKey={`level_${block.id}`}
                dot={false}
                name={block.value?.name}
              />
            );
          })}
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="time" minTickGap={20} angle={-60} dy={45} dx={-25}>
          <Label value="Time" offset={-90} position="insideBottom" />
        </XAxis>

        <YAxis>
          <Label value="Water level" angle={-90} position="middle" dx={-25} />
        </YAxis>

        {data.length > 0 && (
          <Tooltip
            contentStyle={{ backgroundColor: "gray" }}
            wrapperStyle={{ color: "black" }}
          />
        )}
      </LineChart>
      {loading && (
        <div className="loading-container">
          <div className="loading" />
        </div>
      )}
    </div>
  );

  const updateData = async () => {
    setLoading(true);
    const heightData: ChartData[] = [];

    if (blocks) {
      for (let block of blocks) {
        const blockHeightData: ChartData[] = [];
        if (block.value) {
          const response = await axios.get(
            `${apiUrl}/tidalwater?harborId=${block.value.id}`,
          );
          const tidalWater: TidalWater = response.data as TidalWater;

          for (let value of tidalWater.values) {
            const date = new Date(value.timeUTC);
            const dateString = `${date.getDay()}. ${date.toLocaleDateString("default", { month: "short" })} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

            blockHeightData.push({
              time: dateString,
              level: value.surge,
            });
          }

          block.data = blockHeightData;
          heightData.push(...blockHeightData);
        }
      }
    }

    setData(heightData);
    setLoading(false);
  };

  const handleLocationChange = async (e: any, id: string) => {
    const selectedLocation = harbors.find(
      (harbor) => harbor.name === e.target.value,
    );

    if (blocks) {
      if (blocks.find((block) => block.id === id)) {
        // @ts-expect-error ts-migrate(2532)
        blocks.find((block) => block.id === id).value = selectedLocation;
      }
    }

    await updateData();
  };

  const addBlock = (e: any) => {
    setBlocks([
      ...blocks,
      {
        id: (blocks ?? []).length.toString(),
        value: undefined,
        data: [],
      },
    ]);
  };

  const removeBlock = (id: string) => {
    setBlocks((blocks ?? []).filter((block) => block.id !== id));
  };

  return (
    <div className="tidal-water">
      {renderLineChart}
      <div className="locations-container">
        <div className="locations">
          {blocks &&
            blocks.map((block) => {
              return (
                <div className="location-block" key={block.id}>
                  <label htmlFor={`dropdown_${block.id}`}>
                    Select a location:
                  </label>
                  <br />
                  <select
                    id={`dropdown_${block.id}`}
                    value={block.value?.name}
                    onChange={(e: any) => handleLocationChange(e, block.id)}
                  >
                    <option key="" value={undefined}></option>
                    {harbors.map((harbor) => (
                      <option key={harbor.id} value={harbor.name}>
                        {harbor.name}
                      </option>
                    ))}
                  </select>

                  <button
                    className="remove-location"
                    onClick={(e: any) => removeBlock(block.id)}
                  >
                    X
                  </button>

                  <div
                    className="block-color"
                    style={{
                      backgroundColor:
                        colors[parseInt(block.id) % colors.length],
                    }}
                  />
                </div>
              );
            })}
        </div>
        <button className="add-location" onClick={addBlock}>
          Add new location
        </button>
      </div>
    </div>
  );
};

export default TidalWaterPage;
