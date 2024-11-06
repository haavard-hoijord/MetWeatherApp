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
        gradientColors: ["blue", "cyan", "lightblue"],
        subTitle: harbor ? " > Harbor: " + harbor.name : "",
        yAxisDomain: [-0.1, 0.1],
        gradientRange: [-0.2, 0.2],
        formatter: (value: any) =>
          `${Math.abs(value) > 100 ? `${parseFloat((value / 100).toFixed(2))}m` : `${parseFloat(value.toFixed(2))}cm`}`,
      }}
    />
  );
};

export default TidalChart;
