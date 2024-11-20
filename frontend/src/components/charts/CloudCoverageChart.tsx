import { useTranslation } from "react-i18next";
import BaseChart from "./BaseChart.tsx";

const CloudCoverageChart = ({
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
				dataKey: "details.cloudAreaFraction",
				timeKey: "time",
				name: t("chart.cloudCoverage"),
				id: "cloud-coverage",
				strokeColor: "white",
				strokeWith: 2,
				useGradient: true,
				gradientColors: [
					"#f0f8ff", // Light blue (clear skies, 0%)
					"#d3d3d3", // Light gray (20% coverage)
					"#a9a9a9", // Medium gray (40% coverage)
					"#808080", // Gray (60% coverage)
					"#505050", // Dark gray (80% coverage)
					"#2b2b2b", // Very dark gray (complete overcast, 100%)
				],
				yAxisDomain: [0, 100],
				gradientRange: [0, 100],
				dot: true,
				suffix: data?.units.cloudAreaFraction ?? "%",
				usePadding: true,
			}}
		/>
	);
};

export default CloudCoverageChart;
