import { TidalWater } from "../../types/TidalWater";
import BaseChart from "./BaseChart.tsx";

const TidalChart = ({
  data,
  timeRange,
}: {
  data: TidalWater | undefined;
  timeRange: Date[] | undefined;
}) => {
  return (
    <BaseChart
      data={data?.values}
      timeRange={timeRange}
      info={{
        dataKey: "surge",
        timeKey: "timeUtc",
        name: "Tidal Water",
        strokeColor: "",
        strokeWith: 0,
        useGradient: true,
        gradientColors: ["blue", "cyan"],
        formatter: (value: any) =>
          `${Math.abs(value) > 100 ? `${parseFloat((value / 100).toFixed(2))}m` : `${parseFloat(value.toFixed(2))}cm`}`,
      }}
    />
  );
};

export default TidalChart;
