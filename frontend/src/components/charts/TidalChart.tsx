import { TidalWater } from "../../types/TidalWater";
import BaseChart from "./BaseChart.tsx";
import { Harbor } from "../../types/Harbor";

const TidalChart = ({
  data,
  harbor,
  timeRange,
}: {
  data: TidalWater | undefined;
  harbor: Harbor | undefined;
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
        subTitle: harbor ? " > Harbor: " + harbor.name : "",
        formatter: (value: any) =>
          `${Math.abs(value) > 100 ? `${parseFloat((value / 100).toFixed(2))}m` : `${parseFloat(value.toFixed(2))}cm`}`,
      }}
    />
  );
};

export default TidalChart;
