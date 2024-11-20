import { useTranslation } from "react-i18next";
import BaseChart from "./BaseChart.tsx";

const HumidityChart = ({
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
				dataKey: "details.relativeHumidity",
				timeKey: "time",
				name: t("chart.humidity"),
				id: "humidity",
				strokeColor: "white",
				strokeWith: 2,
				useGradient: true,
				gradientColors: [
					"#fffde7", // Light yellow (very dry)
					"#fff176", // Yellow (dry)
					"#aed581", // Light green (moderate humidity)
					"#4caf50", // Green (humid)
					"#1e88e5", // Dark blue (very humid)
				],
				gradientRange: [0, 100],
				yAxisDomain: [0, 100],
				dot: true,
				suffix: data?.units.relativeHumidity ?? "%",
				usePadding: true,
			}}
		/>
	);
};

export default HumidityChart;
