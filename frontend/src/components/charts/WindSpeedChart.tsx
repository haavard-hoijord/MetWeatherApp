import { useTranslation } from "react-i18next";
import BaseChart from "./BaseChart.tsx";
import { LabelProps } from "recharts";

const WindSpeedChart = ({
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
				dataKey: "details.windSpeed",
				timeKey: "time",
				name: t("chart.windSpeed"),
				id: "wind-speed",
				strokeColor: "white",
				strokeWith: 2,
				useGradient: true,
				useChartPadding: true,
				gradientColors: [
					"#b0e0e6", // Light blue for calm (0 m/s)
					"#7ec8e3", // Sky blue (3 m/s)
					"#5dbcd2", // Light teal (6 m/s)
					"#aeea00", // Light green for moderate wind (9 m/s)
					"#ffd700", // Yellow (12 m/s)
					"#ffb347", // Orange (15 m/s)
					"#ff8c00", // Deep orange (18 m/s)
					"#ff4500", // Red-orange for high wind (21 m/s)
					"#d32f2f", // Deep red (24 m/s)
					"#800080", // Dark purple for extreme wind (25+ m/s)
				],
				gradientRange: [0, 25],
				suffix: data?.units.windSpeed ?? "m/s",
				showDot: true,
			}}
		/>
	);
};

export default WindSpeedChart;
