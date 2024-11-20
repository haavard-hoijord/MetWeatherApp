import { useTranslation } from "react-i18next";
import BaseChart from "./BaseChart.tsx";

const PrecipitationChart = ({
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
				dataKey: "details.precipitationAmount",
				timeKey: "time",
				name: t("chart.precipitation"),
				id: "precipitation",
				strokeColor: "white",
				strokeWith: 2,
				useGradient: true,
				gradientColors: [
					"#e3f2fd", // Very light blue (no rain)
					"#90caf9", // Light blue (light rain)
					"#42a5f5", // Moderate blue (moderate rain)
					"#1e88e5", // Dark blue (heavy rain)
					"#6a1b9a", // Purple (very heavy rain)
				],
				gradientRange: [0, 50],
				dot: true,
				suffix: data?.units.precipitationAmount ?? "mm",
				usePadding: true,
			}}
		/>
	);
};

export default PrecipitationChart;
