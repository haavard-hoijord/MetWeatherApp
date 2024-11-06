import BaseChart from "./BaseChart.tsx";

const CloudCoverageChart = ({
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
        dataKey: "details.cloudAreaFraction",
        timeKey: "time",
        name: "Cloud Coverage",
        strokeColor: "white",
        fillColor: "none",
        strokeWith: 2,
        useGradient: false,
        gradientColors: ["white", "gray"],
        yAxisDomain: [0, 100],
        dot: true,
        suffix: "%",
        usePadding: true,
      }}
    />
  );
};

export default CloudCoverageChart;
