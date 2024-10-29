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
        strokeColor: "gray",
        strokeWith: 2,
        useGradient: true,
        gradientColors: ["white", "gray"],
        yAxisDomain: [0, 100],
        suffix: "%",
      }}
    />
  );
};

export default CloudCoverageChart;
