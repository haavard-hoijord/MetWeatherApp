import { useTranslation } from "react-i18next";
import BaseChart from "./BaseChart.tsx";

const AirPressureChart = ({
	data,
	timeRange,
}: {
	data: WeatherData | undefined;
	timeRange: Date[] | undefined;
}) => {
	const { t } = useTranslation();

	return (
		<BaseChart
			data={data?.timeSteps}
			timeRange={timeRange}
			info={{
				dataKey: "details.airPressureAtSeaLevel",
				timeKey: "time",
				name: t("chart.airPressure"),
				id: "air-pressure",
				strokeColor: "white",
				strokeWith: 2,
				useGradient: true,
				gradientColors: [
					"#eeeeee", // Light gray (low pressure)
					"#bdbdbd", // Medium gray
					"#757575", // Dark gray
					"#424242", // Very dark gray
					"#000000", // Black (high pressure)
				],
				gradientRange: [950, 1050],
				showDot: true,
				suffix: data?.units.airPressureAtSeaLevel ?? "hPa",
				useChartPadding: true,
			}}
		/>
	);
};

export default AirPressureChart;
