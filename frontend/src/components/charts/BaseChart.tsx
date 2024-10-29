import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TidalWater, TidalWaterValue } from "../../types/TidalWater";

type ChartInfo = {
  dataKey: string;
  timeKey: string;
  name: string;
  strokeColor: string;
  strokeWith?: number;
  useGradient: boolean;
  gradientColors?: string[];
  yAxisDomain?: [number, number];
  suffix?: string;
  formatter?: (data: any) => string;
};

const BaseChart = ({
  data,
  timeRange,
  info,
}: {
  data: (TidalWaterValue | WeatherTimeStep)[] | undefined;
  info: ChartInfo;
  timeRange: Date[] | undefined;
}) => {
  if (!data) return null;

  function getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((acc, key) => acc && acc[key], obj);
  }
  const min = Math.min(
    info.yAxisDomain?.[0] ?? 0,
    Math.floor(
      Math.min(...data.map((s) => getNestedValue(s, info.dataKey) as number)),
    ),
  );
  const max = Math.max(
    info.yAxisDomain?.[1] ?? 0,
    Math.ceil(
      Math.max(...data.map((s) => getNestedValue(s, info.dataKey) as number)),
    ),
  );
  let domain = info.yAxisDomain ? [min, max] : ["auto", "auto"];
  let gradient = (info.useGradient ? info.gradientColors : undefined) ?? [
    "white",
    "white",
  ];

  return (
    <>
      {data && (
        <div className="info-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data.filter((d: any) => {
                if (!timeRange) return true;

                const valueTime = new Date(d[info.timeKey]);
                const startTime = timeRange[0];
                const endTime = timeRange[1];

                return valueTime >= startTime && valueTime <= endTime;
              })}
              margin={{ top: 20, left: 40, right: 20, bottom: 100 }}
            >
              <defs>
                <linearGradient
                  id={`gradiantColor${info.name.replace(" ", "")}`}
                  x1="1"
                  y1="1"
                  x2="1"
                  y2="0"
                >
                  {gradient.map((color, index) => {
                    const prog = index / (gradient.length - 1);
                    const progValue = info.yAxisDomain
                      ? (info.yAxisDomain?.[1] ?? 0 / (domain as number[])[1])
                      : 1;
                    return (
                      <stop
                        key={index}
                        offset={`${prog * (100 * progValue)}%`}
                        stopColor={color}
                        stopOpacity={1}
                      />
                    );
                  })}
                  ;
                </linearGradient>
              </defs>
              <Area
                dataKey={info.dataKey}
                stroke={info.strokeColor}
                fill={
                  info.useGradient
                    ? `url(#gradiantColor${info.name.replace(" ", "")})`
                    : "none"
                }
                strokeWidth={info.strokeWith ?? 3}
                name={info.name}
                type={"monotone"}
                // label={
                //   <img
                //     src={
                //       "https://raw.githubusercontent.com/metno/weathericons/refs/heads/main/weather/svg/clearsky_day.svg"
                //     }
                //   />
                // }
              />
              <XAxis
                minTickGap={30}
                angle={-70}
                dy={50}
                dx={-20}
                stroke="#000000"
                dataKey={info.timeKey}
                tickFormatter={(value, index) => {
                  const date = new Date(value);
                  const dateString = `${date.getDate()}. ${date.toLocaleDateString("default", { month: "short" })}`;
                  const timeString = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
                  return `${dateString}, ${timeString}`;
                }}
              />
              <YAxis
                tickFormatter={
                  info.formatter
                    ? info.formatter
                    : (value: any) =>
                        `${value}${info.suffix ? info.suffix : ""}`
                }
                tickCount={30}
                // minTickGap={10}
                domain={domain}
              />
              <Tooltip
                animationDuration={0}
                isAnimationActive={false}
                wrapperStyle={{ color: "black" }}
                formatter={(value: any) =>
                  info.formatter
                    ? info.formatter(value)
                    : `${value}${info.suffix ? info.suffix : ""}`
                }
                labelFormatter={(value: any) => {
                  const date = new Date(value);
                  const dateString = `${date.getDate()}. ${date.toLocaleDateString("default", { month: "short" })}`;
                  const timeString = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
                  return `${dateString}, ${timeString}`;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

export default BaseChart;
