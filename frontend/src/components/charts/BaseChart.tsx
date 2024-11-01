import {
  Area,
  AreaChart,
  LabelList,
  LabelProps,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TidalWaterValue } from "../../types/TidalWater";
import { ReactElement } from "react";

type ChartInfo = {
  dataKey: string;
  timeKey: string;
  name: string;
  strokeColor: string;
  strokeWith?: number;
  fillColor?: string;
  useGradient: boolean;
  gradientColors?: string[];
  gradientRange?: [number, number];
  yAxisDomain?: [number, number];
  suffix?: string;
  formatter?: (data: any) => string;
  subTitle?: string;
  disableTooltip?: boolean;
  disableYAxis?: boolean;
  disableXAxis?: boolean;
  dot?: boolean;
  usePadding?: boolean;
  label?: (x: any, y: any, value: any, index: any) => ReactElement;
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
      Math.min(
        ...data
          .filter((s) => {
            const val = getNestedValue(s, info.dataKey);
            return val && !isNaN(val);
          })
          .map((s) => getNestedValue(s, info.dataKey) as number),
      ),
    ),
  );
  const max = Math.max(
    info.yAxisDomain?.[1] ?? 0,
    Math.ceil(
      Math.max(
        ...data
          .filter((s) => {
            const val = getNestedValue(s, info.dataKey);
            return val && !isNaN(val);
          })
          .map((s) => getNestedValue(s, info.dataKey) as number),
      ),
    ),
  );
  let domain = info.yAxisDomain ? [min, max] : ["auto", "auto"];
  let gradient = (info.useGradient ? info.gradientColors : undefined) ?? [
    "white",
    "white",
  ];

  const minRange = info.gradientRange?.[0] ?? 0;
  const maxRange = info.gradientRange?.[1] ?? 0;

  const rangeSpan = maxRange - minRange;

  const maxValue = max;
  const minValue = min;

  const inRangeColors = gradient
    .map((color, index) => {
      const value = minRange + (index / (gradient.length - 1)) * rangeSpan;
      return { color, value };
    })
    .filter(({ value }) => value >= minValue && value <= maxValue);

  // @ts-ignore
  return (
    <>
      {data && (
        <div className="info-chart">
          <h2>{info.name}</h2>
          {info.subTitle && <h3>{info.subTitle}</h3>}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data.filter((d: any) => {
                if (!timeRange) return true;

                const valueTime = new Date(d[info.timeKey]);
                const startTime = timeRange[0];
                const endTime = timeRange[1];

                return valueTime > startTime && valueTime < endTime;
              })}
              margin={{ top: 20, left: 40, right: 40, bottom: 80 }}
              title={info.name}
            >
              {info.useGradient && (
                <defs>
                  <linearGradient
                    id={`gradiantColor${info.name.replace(" ", "")}`}
                    x1="1"
                    y1="1"
                    x2="1"
                    y2="0"
                  >
                    {inRangeColors.map(({ color, value }, index) => {
                      const offset = (index / (inRangeColors.length - 1)) * 100; // Evenly distribute offsets from 0% to 100%
                      const clampedOffset = Math.max(0, Math.min(100, offset));

                      return (
                        <stop
                          key={index}
                          offset={`${clampedOffset}%`}
                          stopColor={color}
                        />
                      );
                    })}
                    ;
                  </linearGradient>
                </defs>
              )}
              {!info.disableXAxis && (
                <XAxis
                  padding={info.usePadding ? { left: 20, right: 20 } : {}}
                  minTickGap={20}
                  dy={5}
                  stroke="#000000"
                  dataKey={info.timeKey}
                  tickFormatter={(value, index) => {
                    const date = new Date(value);
                    const dateString = `${date.getDate()}. ${date.toLocaleDateString("default", { month: "short" })}`;
                    const timeString = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
                    if (dateString && (date.getHours() === 0 || index === 0)) {
                      return dateString;
                    }
                    return timeString;
                  }}
                />
              )}
              {!info.disableYAxis && (
                <YAxis
                  padding={info.usePadding ? { top: 20, bottom: 20 } : {}}
                  tickFormatter={
                    info.formatter
                      ? info.formatter
                      : (value: number) =>
                          `${value.toFixed(value === Math.round(value) ? undefined : 2)}${info.suffix ? info.suffix : ""}`
                  }
                  tickCount={10}
                  domain={domain}
                />
              )}
              <Area
                dataKey={info.dataKey}
                stroke={info.strokeColor}
                fill={
                  info.useGradient
                    ? `url(#gradiantColor${info.name.replace(" ", "")})`
                    : info.fillColor
                }
                strokeWidth={info.strokeWith ?? 3}
                name={info.name}
                type={"monotone"}
                dot={info.dot}
              >
                {info.label && (
                  <LabelList
                    dataKey={info.dataKey}
                    content={({ x, y, value, index }) => {
                      return info.label ? info.label(x, y, value, index) : null;
                    }}
                  />
                )}
              </Area>
              {!info.disableTooltip && (
                <Tooltip
                  animationDuration={0}
                  isAnimationActive={false}
                  wrapperStyle={{ color: "black" }}
                  formatter={(value: any) =>
                    info.formatter
                      ? info.formatter(value)
                      : `${value.toFixed(value === Math.round(value) ? undefined : 2)}${info.suffix ? info.suffix : ""}`
                  }
                  labelFormatter={(value: any) => {
                    const date = new Date(value);
                    const dateString = `${date.getDate()}. ${date.toLocaleDateString("default", { month: "short" })}`;
                    const timeString = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
                    return `${dateString}, ${timeString}`;
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

export default BaseChart;
