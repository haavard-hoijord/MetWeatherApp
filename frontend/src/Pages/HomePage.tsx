import { Page } from "../types/Page";
import { APIProvider } from "@vis.gl/react-google-maps";

import "./HomePage.css";
import MapComponent from "../components/HomePageMapComponent.tsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { Harbor } from "../types/Harbor";
import { TidalWater } from "../types/TidalWater";
import {
  Area,
  AreaChart,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const google_api_key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const HomePage = ({ setError, setLoading, loading, apiUrl }: Page) => {
  const [location, setLocation] = useState<google.maps.places.Place>();
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });

  const [timeRange, setTimeRange] = useState<Date[]>();

  const [closestHarbor, setClosestHarbor] = useState<Harbor>();
  const [tidalData, setTidalData] = useState<TidalWater>();
  const [weatherData, setWeatherData] = useState<any>();

  useEffect(() => {
    if (!TimeRanges) {
      setTimeRangeFunc(7);
    }
  }, []);

  function getFullHoursBetweenDates(startDate: Date, endDate: Date): Date[] {
    const fullHours: Date[] = [];
    let currentDate = new Date(startDate);

    // Set to next full hour if startDate is not on a full hour
    currentDate.setMinutes(0, 0, 0);

    // Loop until currentDate is after endDate
    while (currentDate <= endDate) {
      fullHours.push(new Date(currentDate));
      currentDate.setHours(currentDate.getHours() + 1);
    }

    return fullHours;
  }

  const setTimeRangeFunc = (days: number) => {
    const dates = getFullHoursBetweenDates(
      new Date(),
      new Date(new Date().setDate(new Date().getDate() + days)),
    );
    setTimeRange(dates);
  };

  const fetchInfo = async () => {
    if (!location) {
      return;
    }

    try {
      const response = await axios.get(
        `${apiUrl}/harbor/closest?latitude=${position.lat}&longitude=${position.lng}`,
      );
      const harbor: Harbor = response.data as Harbor;
      setClosestHarbor(harbor);

      const tidalResponse = await axios.get(
        `${apiUrl}/tidalwater?harborId=${harbor.id}`,
      );
      const tidalWater: TidalWater = tidalResponse.data as TidalWater;
      setTidalData(tidalWater);

      const weatherResponse = await axios.get(
        `${apiUrl}/forecast?latitude=${position.lat}&longitude=${position.lng}`,
      );
      const weather = weatherResponse.data as any;
      setWeatherData(weather);
      console.log(weather);
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setLocationFunc = async (location: google.maps.places.Place) => {
    setLocation(location);
    setPosition({
      lat: parseFloat(location?.location?.lat().toFixed(4) ?? "0"),
      lng: parseFloat(location?.location?.lng().toFixed(4) ?? "0"),
    });
    await fetchInfo();
  };

  return (
    <div className="home-page">
      <div className="maps-container">
        <APIProvider
          apiKey={google_api_key}
          libraries={["places", "geocoding"]}
          version={"beta"}
          onError={(error) => {
            // @ts-ignore
            setError(error);
            setLoading(false);
          }}
          onLoad={() => setLoading(false)}
        >
          <MapComponent setLocation={setLocationFunc} />
        </APIProvider>
      </div>
      <div className="location-info">
        <h2>{location?.displayName}</h2>
        <p>{location?.formattedAddress}</p>
      </div>
      <div className="chart-section">
        <div className="info-chart tidalwater">
          {tidalData && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={tidalData?.values}
                margin={{ left: 40, right: 20, bottom: 100 }}
              >
                <Area dataKey="surge" name={"Water level"} />
                <XAxis
                  minTickGap={30}
                  angle={-70}
                  dy={50}
                  dx={-20}
                  stroke="#000000"
                  dataKey="timeUtc"
                  tickFormatter={(value, index) => {
                    const date = new Date(value);
                    const dateString = `${date.getDate()}. ${date.toLocaleDateString("default", { month: "short" })}`;
                    const timeString = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
                    return `${dateString}, ${timeString}`;
                  }}
                />
                <YAxis
                  tickFormatter={(value: any) =>
                    `${Math.abs(value) > 100 ? `${parseFloat((value / 100).toFixed(2))}m` : `${parseFloat(value.toFixed(2))}cm`}`
                  }
                />
                <Tooltip
                  animationDuration={0}
                  isAnimationActive={false}
                  itemSorter={(item: any) => -item.value}
                  formatter={(value: any) =>
                    `${Math.abs(value) > 100 ? `${parseFloat((value / 100).toFixed(2))}m` : `${parseFloat(value.toFixed(2))}cm`}`
                  }
                  wrapperStyle={{ color: "black" }}
                  labelFormatter={(value: any) => {
                    const date = new Date(value);
                    const dateString = `${date.getDate()}. ${date.toLocaleDateString("default", { month: "short" })}`;
                    const timeString = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
                    return `${dateString}, ${timeString}`;
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="info-chart chart2"></div>
        <div className="info-chart chart3"></div>
        <div className="info-chart chart4"></div>
        <div className="info-chart chart4"></div>
        <div className="info-chart chart4"></div>
        <div className="info-chart chart4"></div>
        <div className="info-chart chart4"></div>
        <div className="info-chart chart4"></div>
        <div className="info-chart chart4"></div>
      </div>
    </div>
  );
};

export default HomePage;
