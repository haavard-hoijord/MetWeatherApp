import { TidalWater } from "../../types/TidalWater";
import BaseChart from "./BaseChart.tsx";
import { Harbor } from "../../types/Harbor";
import { useTranslation } from "react-i18next";

const TidalChart = ({
	data,
	harbor,
	timeRange,
}: {
	data: TidalWater | undefined;
	harbor: Harbor | undefined;
	timeRange: Date[] | undefined;
}) => {
	const { t } = useTranslation();
	if (!harbor) return null;
	return (
		<BaseChart
			data={data?.values}
			timeRange={timeRange}
			info={{
				dataKey: "surge",
				timeKey: "timeUtc",
				name: t("chart.tidalWaterLevel.title"),
				id: "tidal-water-level",
				strokeColor: "",
				strokeWith: 0,
				useGradient: true,
				gradientColors: [
					"#0f1b4c", // Dark Navy Blue
					"#142360", // Deep Blue
					"#1a2e7a", // Slightly Lighter Blue
					"#1f3b8f", // Dark Royal Blue
					"#2348a3", // Medium Royal Blue
					"#2756b8", // Blue with a slight brightness increase
					"#2d63cd", // Lighter Blue
					"#3270e2", // Light Royal Blue
					"#4885f4", // Bright Blue with slight cyan tint
					"#5c9dfc", // Light Sky Blue
					"#70b4ff", // Lighter Sky Blue
					"#85caff", // Very Light Blue
					"#9adfff", // Soft Light Blue
					"#afefff", // Light Powder Blue
					"#c3f7ff", // Very Light Cyan
					"#d8faff", // Pale Cyan
					"#ecfdff", // Lightest Cyan
				],
				subTitle: harbor
					? t("chart.tidalWaterLevel.harbor", { harbor: harbor.name })
					: "",
				yAxisRange: [-0.1, 0.1],
				gradientRange: [-0.2, 0.02],
				formatter: (value: any) =>
					`${Math.abs(value) > 100 ? `${parseFloat((value / 100).toFixed(2))}m` : `${parseFloat(value.toFixed(2))}cm`}`,
			}}
		/>
	);
};

export default TidalChart;
