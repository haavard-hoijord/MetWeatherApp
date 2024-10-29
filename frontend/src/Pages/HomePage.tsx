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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import TemperatureChart from "../components/charts/TemperatureChart.tsx";
import TidalChart from "../components/charts/TidalChart.tsx";
import WindSpeedChart from "../components/charts/WindSpeedChart.tsx";
import CloudCoverageChart from "../components/charts/CloudCoverageChart.tsx";

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
  const [weatherData, setWeatherData] = useState<WeatherData>();

  useEffect(() => {
    if (!timeRange) {
      const now = new Date();
      const end = new Date();
      now.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      end.setDate(end.getDate() + 3);
      setTimeRange([now, end]);
      console.log("Time Range", [now, end]);
    }
  }, []);

  const fetchInfo = async () => {
    if (!location) {
      return;
    }

    setLoading(true);
    setError(null);

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
      const weather = weatherResponse.data as WeatherData;
      setWeatherData(weather);
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setLocationFunc = async (location: google.maps.places.Place) => {
    setLocation(location);

    type loctFunc = {
      lat: () => number;
      lng: () => number;
    };

    type loct = {
      lat: number;
      lng: number;
    };

    const loct = location?.location as loctFunc | loct;

    if (
      typeof location?.location?.["lat"] === "function" &&
      typeof location?.location?.["lng"] === "function"
    ) {
      setPosition({
        lat: parseFloat((loct as loctFunc).lat().toFixed(4) ?? "0"),
        lng: parseFloat((loct as loctFunc).lng().toFixed(4) ?? "0"),
      });
    } else {
      setPosition({
        lat: parseFloat((loct as loct).lat.toFixed(4) ?? "0"),
        lng: parseFloat((loct as loct).lng.toFixed(4) ?? "0"),
      });
    }

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
        {loading && (
          <div className="map-loading-container">
            <div className="map-loading" />
          </div>
        )}
      </div>
      <div className="chart-section">
        <TemperatureChart data={weatherData} timeRange={timeRange} />
        <TidalChart data={tidalData} timeRange={timeRange} />
        <WindSpeedChart data={weatherData} timeRange={timeRange} />
        <CloudCoverageChart data={weatherData} timeRange={timeRange} />
      </div>
    </div>
  );
};

export default HomePage;
