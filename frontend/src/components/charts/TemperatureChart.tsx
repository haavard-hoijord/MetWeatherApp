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
        gradientColors: ["#98faf5", "#fff699", "#ff5555"],
        yAxisDomain: [0, 30],
        suffix: "°C",
      }}
    />
  );
};

export default TemperatureChart;
