import BaseChart from "./BaseChart.tsx";

const TemperatureChart = ({
	data,
	timeRange,
}: {
	data: WeatherData | undefined;
	timeRange: Date[] | undefined;
}) => {
	return (
		<BaseChart
			data={data?.timeSteps}
			timeRange={timeRange}
			info={{
				dataKey: "details.airTemperature",
				timeKey: "time",
				name: "Temperature",
				strokeColor: "",
				strokeWith: 3,
				useGradient: true,
				gradientColors: [
					"#3b80ff", // Cold blue, around -10°C
					"#5ca2ff", // Slightly warmer blue, around -5°C
					"#98daf5", // Light blue, around 2°C
					"#b3f7f1", // Cyan, around 8°C
					"#f2f6a0", // Soft yellow, around 14°C
					"#ffdd75", // Warmer yellow, around 20°C
					"#ffc242", // Orange-yellow, around 26°C
					"#ff8f55", // Orange, around 32°C
					"#ff6161", // Red-orange, around 38°C
					"#e64598", // Magenta, around 44°C
					"#b50390", // Deep pink, around 50°C
					"#000000", // Black, above 50°C
				],
				yAxisDomain: [0, 30],
				gradientRange: [-10, 50],
				suffix: "°C",
			}}
		/>
	);
};

export default TemperatureChart;
