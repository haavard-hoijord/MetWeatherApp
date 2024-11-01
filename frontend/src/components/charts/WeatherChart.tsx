import BaseChart from "./BaseChart.tsx";
import { LabelProps } from "recharts";

const WeatherChart = ({
  data,
  timeRange,
}: {
  data: WeatherData | undefined;
  timeRange: Date[] | undefined;
}) => {
  interface CustomLabelProps extends LabelProps {
    iconUrl: string;
  }

  const CustomImageLabel: React.FC<CustomLabelProps> = ({ x, y, iconUrl }) => {
    return <image href={iconUrl} x={x} y={y} width={32} height={32} />;
  };

  const filteredData = data?.timeSteps
    .filter((s) => s.symbolCode)
    .filter((d: any) => {
      if (!timeRange) return true;

      const valueTime = new Date(d["time"]);
      const startTime = timeRange[0];
      const endTime = timeRange[1];

      return valueTime >= startTime && valueTime <= endTime;
    });

  return (
    <BaseChart
      data={data?.timeSteps.filter((s) => s.symbolCode)}
      timeRange={timeRange}
      info={{
        dataKey: "details.airTemperature",
        timeKey: "time",
        name: "Weather",
        strokeColor: "white",
        fillColor: "none",
        strokeWith: 3,
        useGradient: false,
        disableTooltip: true,
        usePadding: true,
        dot: true,
        yAxisDomain: [
          Math.min(
            0,
            ...(data?.timeSteps.map((s) => s.details.airTemperature) ?? []),
          ),
          Math.max(
            1,
            ...(data?.timeSteps.map((s) => s.details.airTemperature) ?? []),
          ) + 3,
        ],
        label: (x, y, value, index) => {
          return (
            <>
              <CustomImageLabel
                x={x - 16}
                y={y - 40}
                iconUrl={`https://raw.githubusercontent.com/metno/weathericons/refs/heads/main/weather/svg/${data?.timeSteps[index as number].symbolCode}.svg`}
              />
              {index % 2 === 0 || (filteredData?.length ?? 0) <= 40 ? (
                <text x={x} y={y} dy={25} fill="white" textAnchor="middle">
                  {value}°C
                </text>
              ) : null}
            </>
          );
        },
      }}
    />
  );
};

export default WeatherChart;
