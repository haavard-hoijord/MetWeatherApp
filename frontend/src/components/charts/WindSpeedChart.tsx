import BaseChart from "./BaseChart.tsx";

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
        strokeColor: "gray",
        strokeWith: 2,
        useGradient: true,
        gradientColors: ["white", "gray"],
        suffix: "m/s",
      }}
    />
  );
};

export default WindSpeedChart;
