import {
	Area,
	AreaChart,
	LabelList,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { TidalWaterValue } from "../../types/TidalWater";
import { ReactElement } from "react";
import { LocalLoading } from "../../App.tsx";
import styled, { useTheme } from "styled-components";
import { SecondaryContainer } from "../../Styles.ts";

type ChartInfo = {
	dataKey: string;
	timeKey: string;
	name: string;
	id: string;
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

	const theme = useTheme(); // Access the current theme

	function getNestedValue(obj: any, path: string): any {
		const val = path.split(".").reduce((acc, key) => acc && acc[key], obj);
		return isNaN(val) ? 0 : parseFloat(val);
	}

	const minValue = Math.min(
		...data.map((d) => getNestedValue(d, info.dataKey))
	);
	const maxValue = Math.max(
		...data.map((d) => getNestedValue(d, info.dataKey))
	);

	const min = Math.min(info.yAxisDomain?.[0] ?? 0, minValue);
	const max = Math.max(info.yAxisDomain?.[1] ?? 0, maxValue);
	let domain = info.yAxisDomain ? [min, max] : ["auto", "auto"];
	let gradient = (info.useGradient ? info.gradientColors : undefined) ?? [
		"white",
		"white",
	];

	const minRange = info.gradientRange?.[0] ?? 0;
	const maxRange = info.gradientRange?.[1] ?? 0;

	const rangeSpan = maxRange - minRange;

	const inRangeColors = gradient
		.map((color, index) => {
			const value = minRange + (index / (gradient.length - 1)) * rangeSpan;
			return { color, value };
		})
		.filter(({ value }) => value <= maxValue);

	type dailyTick = {
		day: string;
		time: number;
	};

	const pointTime = (point: TidalWaterValue | WeatherTimeStep) =>
		(point as unknown as any)[info.timeKey];

	const dailyTicks = data
		.reduce<dailyTick[]>((acc, point, index) => {
			const date = new Date(pointTime(point));
			const dayString = date.toLocaleDateString();
			const time = pointTime(point);

			// Check if this is the start of a new day
			if (index === 0 || dayString !== acc[acc.length - 1].day) {
				acc.push({ day: dayString, time });
			}
			return acc;
		}, [])
		.map((tick) => tick.time);

	return (
		<>
			{!data && <LocalLoading />}
			<InfoChart className="info-chart">
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
									id={`gradiantColor${info.id}`}
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
								dataKey={info.timeKey}
								stroke={theme.textColor}
								ticks={dailyTicks}
								style={{ fontWeight: "bold" }}
								tickFormatter={(value) => {
									const date = new Date(value);
									return `${date.getDate()}. ${date.toLocaleDateString("default", { month: "short" })}`;
								}}
								axisLine={false}
								tickLine={false}
								xAxisId="day"
								height={35}
								dy={4}
								interval="preserveStartEnd"
							/>
						)}
						{!info.disableXAxis && (
							<XAxis
								padding={info.usePadding ? { left: 35, right: 35 } : {}}
								minTickGap={20}
								dy={5}
								stroke={theme.textColor}
								dataKey={info.timeKey}
								interval="preserveStartEnd"
								tickFormatter={(value, index) => {
									const date = new Date(value);
									return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
								}}
								xAxisId="time"
							/>
						)}

						{!info.disableXAxis &&
							dailyTicks.map((tick) => (
								<ReferenceLine
									x={tick}
									xAxisId="time"
									stroke="gray"
									strokeDasharray="3 3"
									key={tick}
								/>
							))}

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
								stroke={theme.textColor}
								interval="preserveStartEnd"
							/>
						)}
						<Area
							dataKey={info.dataKey}
							stroke={info.strokeColor}
							fill={
								info.useGradient
									? `url(#gradiantColor${info.id})`
									: info.fillColor
							}
							strokeWidth={info.strokeWith ?? 3}
							name={info.name}
							type={"monotone"}
							dot={info.dot}
							xAxisId="time"
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
								itemStyle={{ color: "black" }}
								animationDuration={0}
								isAnimationActive={false}
								wrapperStyle={{ color: "black" }}
								formatter={(value: any) =>
									info.formatter
										? info.formatter(value)
										: `${value.toFixed(value === Math.round(value) ? undefined : 2)}${info.suffix ? info.suffix : ""}`
								}
								labelFormatter={(value: any) => {
									if (!value) return "<Missing>";

									const date = new Date(value);
									const dateString = `${date.getDate()}. ${date.toLocaleDateString("default", { month: "short" })}`;
									const timeString = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
									return `${dateString}, ${timeString}`;
								}}
							/>
						)}
					</AreaChart>
				</ResponsiveContainer>
			</InfoChart>
		</>
	);
};

export default BaseChart;

export const InfoChart = styled(SecondaryContainer)`
	position: relative;
	margin: 10px;
	h3 {
		color: lightslategrey;
	}
`;
