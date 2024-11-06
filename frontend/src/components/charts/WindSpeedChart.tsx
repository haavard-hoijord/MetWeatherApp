import BaseChart from "./BaseChart.tsx";
import { LabelProps } from "recharts";

const WindSpeedChart = ({
  data,
  timeRange,
}: {
  data: WeatherData | undefined;
  timeRange: Date[] | undefined;
}) => {
  return (
    <BaseChart
      data={data?.timeSteps}
      timeRange={timeRange}
      info={{
        dataKey: "details.windSpeed",
        timeKey: "time",
        name: "Wind Speed",
        strokeColor: "white",
        strokeWith: 2,
        useGradient: true,
        gradientColors: ["white", "gray"],
        suffix: "m/s",
        dot: true,
      }}
    />
  );
};

export default WindSpeedChart;
