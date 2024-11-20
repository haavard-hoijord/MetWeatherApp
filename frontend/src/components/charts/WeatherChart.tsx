import { useTranslation } from "react-i18next";
import BaseChart from "./BaseChart.tsx";
import styled, { useTheme } from "styled-components";
import { InfoChart } from "../../Styles.ts";

const WeatherChart = ({
	data,
	timeRange,
}: {
	data: WeatherData | undefined;
	timeRange: Date[] | undefined;
}) => {
	const theme = useTheme();
	const { t } = useTranslation();
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
					suffix: data?.units.airTemperature === "celsius" ? "°C" : "°F",
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
							<WeatherLabel>
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
									{value}
									{data?.units.airTemperature === "celsius" ? "°C" : "°F"}
								</text>
							</WeatherLabel>
						);
					},
				}}
			/>
		</WeatherChartStyle>
	);
};

const WeatherLabel = styled.g`
	display: none;
	font-weight: bold;
	font-size: small;

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
