import { useTranslation } from "react-i18next";
import BaseChart, { InfoChart } from "./BaseChart.tsx";
import { LabelProps } from "recharts";
import styled, { useTheme } from "styled-components";

const WeatherChart = ({
	data,
	timeRange,
}: {
	data: WeatherData | undefined;
	timeRange: Date[] | undefined;
}) => {
	const theme = useTheme();
	const { t } = useTranslation();

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
		<WeatherChartStyle>
			<BaseChart
				data={data?.timeSteps.filter((s) => s.symbolCode)}
				timeRange={timeRange}
				info={{
					dataKey: "details.airTemperature",
					timeKey: "time",
					name: t("chart.weather"),
					id: "weather",
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
							...(data?.timeSteps.map((s) => s.details.airTemperature) ?? [])
						),
						Math.max(
							1,
							...(data?.timeSteps.map((s) => s.details.airTemperature) ?? [])
						) + 3,
					],
					label: (x, y, value, index) => {
						return (
							<ResponsiveLabel>
								<image
									href={`https://raw.githubusercontent.com/metno/weathericons/refs/heads/main/weather/svg/${data?.timeSteps[index as number].symbolCode}.svg`}
									x={x - 16}
									y={y - 40}
									width={32}
									height={32}
								/>
								<text
									x={x}
									y={y}
									dy={25}
									fill={theme.textColor}
									textAnchor="middle"
								>
									{value}°C
								</text>
							</ResponsiveLabel>
						);
					},
				}}
			/>
		</WeatherChartStyle>
	);
};

const ResponsiveLabel = styled.g`
	display: none;

	&:nth-of-type(2n) {
		@media (min-width: 900px) {
			&:nth-of-type(3n) {
				display: block;
			}
		}
		@media (min-width: 1300px) {
			&:nth-of-type(2n) {
				display: block;
			}
		}
	}

	@media (min-width: 2400px) {
		display: block;
	}
`;

export default WeatherChart;

const WeatherChartStyle = styled.div`
	${InfoChart} {
		height: 480px;
	}
`;
