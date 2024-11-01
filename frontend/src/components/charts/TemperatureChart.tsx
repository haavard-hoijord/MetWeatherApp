import BaseChart from "./BaseChart.tsx";

const TemperatureChart = ({
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
        dataKey: "details.airTemperature",
        timeKey: "time",
        name: "Temperature",
        strokeColor: "",
        strokeWith: 3,
        useGradient: true,
        gradientColors: [
          "#3b80ff",
          "#98faf5",
          "#fff699",
          "#ff5555",
          "#b50390",
          "#000",
        ],
        yAxisDomain: [0, 30],
        gradientRange: [-10, 60],
        suffix: "°C",
      }}
    />
  );
};

export default TemperatureChart;
