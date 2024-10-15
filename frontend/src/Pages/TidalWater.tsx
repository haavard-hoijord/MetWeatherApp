import { useEffect, useState } from "react";
import { Harbor } from "../types/Harbor";
import { BlockData, ChartData } from "../types/TidalWater";
import axios from "axios";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./TidalWater.css";
import { TidalWater } from "../types/TidalWater";
import LocationContainer from "../components/LocationBlocks.tsx";

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
  }, []);

  useEffect(() => {
    if (harbors.length > 0) {
      if (!blocks || blocks.length === 0) {
        addBlock(null);
      }
    }
  }, [harbors]);

  useEffect(() => {
    if (blocks.length === 1 && blocks[0].data.length === 0) {
      blocks[0].value = harbors[0];
      updateData();
    }
  }, [blocks]);

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

  const mergeData = (data: BlockData[]) => {
    const mergedData: Record<string, any> = {};

    for (let datum of data) {
      for (let datum1 of datum.data) {
        if (!mergedData[datum1.time]) {
          mergedData[datum1.time] = { time: datum1.time };
        }
        mergedData[datum1.time][`level_${datum.id}`] = datum1.level;
      }
    }
    return Object.values(mergedData);
  };

  //Calculate domain to increase the y-axis range by 20% in both directions
  const calculateDomain = (
    data: ChartData[],
    multiplier: number = 1.1,
  ): [number, number] => {
    const values = data.map((item) => item.level);
    const min = Math.min(...values) * multiplier;
    const max = Math.max(...values) * multiplier;

    return [
      Math.min(parseFloat(min.toFixed(2)), -10),
      Math.max(parseFloat(max.toFixed(2)), 10),
    ];
  };

  const renderLineChart = (
    <div className="chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          margin={{ left: 10, right: 20, bottom: 90 }}
          data={mergeData(blocks?.filter((s) => s.enabled) ?? [])}
        >
          <CartesianGrid
            stroke="#44444444"
            strokeDasharray={"5 5"}
            fill={"#83838399"}
          />

          {blocks &&
            blocks.map((block) => {
              return (
                <Area
                  type="monotone"
                  stroke={colors[block.id % colors.length]}
                  dataKey={`level_${block.id}`}
                  dot={false}
                  name={block.value?.name}
                  key={block.id}
                  fillOpacity={0.2}
                  strokeOpacity={1}
                  strokeWidth={2}
                  fill={colors[block.id % colors.length]}
                  baseValue="dataMin"
                  connectNulls={true}
                />
              );
            })}

          <XAxis
            dataKey="time"
            minTickGap={20}
            angle={-60}
            dy={45}
            dx={-25}
            stroke="#000000"
          />
          <YAxis
            unit="cm"
            tickCount={20}
            stroke="#000000"
            domain={calculateDomain(data)}
          />

          {data.length > 0 && (
            <Tooltip
              animationDuration={0}
              isAnimationActive={false}
              itemSorter={(item: any) => -item.value}
              formatter={(value: any) => `${value}cm`}
              contentStyle={{ backgroundColor: "gray" }}
              wrapperStyle={{ color: "black" }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
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
              level: parseFloat((value.surge * 100).toFixed(2)),
            });
          }

          block.data = blockHeightData;

          if (block.enabled) {
            heightData.push(...blockHeightData);
          }
        }
      }
    }

    setData(heightData);
    setLoading(false);
  };

  const handleLocationChange = async (e: any, id: number) => {
    const selectedLocation = harbors.find(
      (harbor) => harbor.id === e.target.value,
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
    const availableNumbers = [...Array(colors.length).keys()].filter(
      (num) => !blocks.some((s) => s.id === num), // Filter out numbers already in existingNumbers
    );
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    setBlocks([
      ...blocks,
      {
        id: availableNumbers[randomIndex],
        value: undefined,
        data: [],
        enabled: true,
      },
    ]);
  };

  const removeBlock = (id: number) => {
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
                <LocationContainer
                  block={block}
                  blocks={blocks}
                  color={colors[block.id % colors.length]}
                  onClose={() => removeBlock(block.id)}
                  onChange={(e: any) => handleLocationChange(e, block.id)}
                  values={harbors}
                  onToggle={(e: boolean, block: BlockData) => {
                    const bl = blocks.find((bl) => bl.id === block.id);
                    if (bl) {
                      bl.enabled = e;
                      updateData();
                    }
                  }}
                />
              );
            })}
        </div>
        <button
          className="add-location"
          onClick={addBlock}
          disabled={blocks.length >= colors.length}
        >
          Add new location
        </button>
      </div>
    </div>
  );
};

export default TidalWaterPage;
