// noinspection CssUnresolvedCustomProperty

import { Page } from "../types/Page";
import { APIProvider } from "@vis.gl/react-google-maps";
import MapComponent from "../components/MapComponent.tsx";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Harbor } from "../types/Harbor";
import { TidalWater } from "../types/TidalWater";
import TemperatureChart from "../components/charts/TemperatureChart.tsx";
import TidalChart from "../components/charts/TidalChart.tsx";
import WindSpeedChart from "../components/charts/WindSpeedChart.tsx";
import CloudCoverageChart from "../components/charts/CloudCoverageChart.tsx";
import WeatherChart from "../components/charts/WeatherChart.tsx";
import { Slider } from "@mui/material";
import { PrimaryContainer, SecondaryContainer } from "../Styles.ts";
import styled, { useTheme } from "styled-components";
import { ReactSortable, ReactSortableProps } from "react-sortablejs";

export const google_api_key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const HomePage = ({ setError, setLoading, loading, apiUrl }: Page) => {
	const theme = useTheme();

	const [location, setLocation] = useState<google.maps.places.Place>(() => {
		const savedLocation = localStorage.getItem("location");
		return savedLocation ? JSON.parse(savedLocation) : undefined;
	});
	const [position, setPosition] = useState<{ lat: number; lng: number }>({
		lat: 0,
		lng: 0,
	});

	const [timeRange, setTimeRange] = useState<Date[]>();
	const [maxTimeRange, setMaxTimeRange] = useState<Date[]>();
	const [timeRangeDates, setTimeRangeDates] = useState<Date[]>();

	const [closestHarbor, setClosestHarbor] = useState<Harbor>();
	const [tidalData, setTidalData] = useState<TidalWater>();
	const [weatherData, setWeatherData] = useState<WeatherData>();

	const initTimeRange = () => {
		const before = new Date();
		const now = new Date();
		const end = new Date();
		before.setHours(0, 0, 0, 0);
		now.setHours(0, 0, 0, 0);
		end.setHours(0, 0, 0, 0);

		before.setDate(before.getDate() - 7);
		end.setDate(end.getDate() + 7);

		if (
			!timeRange ||
			timeRange[0].getTime() < before.getTime() ||
			timeRange[1].getTime() < now.getTime()
		) {
			setTimeRange([now, end]);
		}
		setMaxTimeRange([before, end]);

		const dates: Date[] = [];
		for (let d = new Date(before); d <= end; d.setDate(d.getDate() + 1)) {
			const date = new Date(d);
			date.setHours(0, 0, 0, 0);

			if (dates.find((d) => d.getTime() === date.getTime())) continue;
			dates.push(date);
		}
		setTimeRangeDates(dates);
	};

	useEffect(() => {
		if (!timeRange) {
			initTimeRange();
		}
	}, []);

	//Fetch new data every 5 minutes
	useEffect(() => {
		const interval = setInterval(
			() => {
				// initTimeRange();
				//
				// if (position) {
				// 	fetchInfo(position, true);
				// }
			},
			1000 * 60 * 5
		);

		return () => clearInterval(interval);
	}, []);

	const fetchInfo = async (
		pos: { lat: number; lng: number },
		async = false
	) => {
		if (!async) {
			setLoading(true);
			setError(null);
		}

		try {
			const response = await axios.get(
				`${apiUrl}/harbor/closest?latitude=${pos.lat}&longitude=${pos.lng}`,
				{ timeout: 10000 }
			);
			const harbor: Harbor = response.data as Harbor;
			setClosestHarbor(harbor);

			if (harbor) {
				const tidalResponse = await axios.get(
					`${apiUrl}/tidalwater?harborId=${harbor.id}`,
					{ timeout: 10000 }
				);
				const tidalWater: TidalWater = tidalResponse.data as TidalWater;
				setTidalData(tidalWater);
			}

			const weatherResponse = await axios.get(
				`${apiUrl}/forecast?latitude=${pos.lat}&longitude=${pos.lng}`,
				{ timeout: 10000 }
			);
			const weather = weatherResponse.data as WeatherData;
			setWeatherData(weather);
		} catch (err: any) {
			console.error(err.message);
			setError(err.message);
		} finally {
			if (!async) {
				setLoading(false);
			}
		}
	};

	type loctFunc = {
		lat: () => number;
		lng: () => number;
	};

	type loct = {
		lat: number;
		lng: number;
	};

	useEffect(() => {
		setTidalData(undefined);
		setClosestHarbor(undefined);

		if (!location) return;

		const loct = location?.location as loctFunc | loct;
		let pos = { lat: 0, lng: 0 };

		if (
			typeof location?.location?.["lat"] === "function" &&
			typeof location?.location?.["lng"] === "function"
		) {
			pos = {
				lat: parseFloat((loct as loctFunc).lat().toFixed(4) ?? "0"),
				lng: parseFloat((loct as loctFunc).lng().toFixed(4) ?? "0"),
			};
		} else {
			pos = {
				lat: parseFloat((loct as loct).lat.toFixed(4) ?? "0"),
				lng: parseFloat((loct as loct).lng.toFixed(4) ?? "0"),
			};
		}
		setPosition(pos);
		fetchInfo(pos);
	}, [location]);

	const [chartOrder, setChartOrder] = useState(() => {
		const savedOrder = localStorage.getItem("chartOrder");
		return savedOrder
			? JSON.parse(savedOrder)
			: [
					{ id: "temperature-chart" },
					{ id: "tidal-chart" },
					{ id: "wind-speed-chart" },
					{ id: "cloud-coverage-chart" },
				];
	});

	// Save order to localStorage whenever chartOrder changes
	useEffect(() => {
		localStorage.setItem("chartOrder", JSON.stringify(chartOrder));
	}, [chartOrder]);

	const renderChart = (chartId: string) => {
		switch (chartId) {
			case "temperature-chart":
				return (
					<TemperatureChart
						key={chartId}
						data={weatherData}
						timeRange={timeRange}
					/>
				);
			case "tidal-chart":
				return (
					<TidalChart
						key={chartId}
						data={tidalData}
						timeRange={timeRange}
						harbor={closestHarbor}
					/>
				);
			case "wind-speed-chart":
				return (
					<WindSpeedChart
						key={chartId}
						data={weatherData}
						timeRange={timeRange}
					/>
				);
			case "cloud-coverage-chart":
				return (
					<CloudCoverageChart
						key={chartId}
						data={weatherData}
						timeRange={timeRange}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<HomePageDiv>
			<MapsContainer>
				<APIProvider
					apiKey={google_api_key}
					libraries={["places", "geocoding"]}
					version={"beta"}
					onError={(error) => {
						// @ts-ignore
						setError(error);
						setLoading(false);
					}}
				>
					<MapComponent setLocation={setLocation} />
				</APIProvider>
			</MapsContainer>
			<WeatherSection>
				<TimeRangeSection>
					<h2>Time Range</h2>
					<DateSlider>
						<Slider
							sx={{
								"& .MuiSlider-thumb": {
									borderRadius: "5px",
								},
								"& .MuiSlider-markLabel": {
									color: theme.textColor,
									marginTop: 3,
								},
							}}
							valueLabelFormat={(value: number, index: number) => {
								let date = new Date(value);
								date = new Date(
									Date.UTC(
										date.getFullYear(),
										date.getMonth(),
										date.getDate(),
										date.getHours()
									)
								);
								return `${date.getDate()}. ${date.toLocaleDateString("default", { month: "short" })}`;
							}}
							valueLabelDisplay="on"
							min={maxTimeRange?.[0].getTime()}
							max={maxTimeRange?.[1].getTime()}
							defaultValue={timeRange?.[0].getTime()}
							value={[...(timeRange?.map((d) => d.getTime()) ?? [])]}
							disableSwap
							step={86400000}
							marks={timeRangeDates?.map((s) => {
								let date = new Date(
									Date.UTC(
										s.getFullYear(),
										s.getMonth(),
										s.getDate(),
										s.getHours()
									)
								);
								return {
									value: s.getTime(),
									label: `${date.getDate()}. ${date.toLocaleDateString("default", { month: "short" })}`,
								};
							})}
							onChange={(_, value) => {
								const val = value as number[];
								if (val.length === 2 && val[1] - val[0] >= 86400000) {
									setTimeRange([new Date(val[0]), new Date(val[1])]);
								}
							}}
						/>
					</DateSlider>
				</TimeRangeSection>
				<WeatherChart data={weatherData} timeRange={timeRange} />
			</WeatherSection>
			<ChartSection list={chartOrder} setList={setChartOrder} animation={150}>
				{chartOrder.map((chart: { id: string }) => renderChart(chart.id))}
			</ChartSection>
		</HomePageDiv>
	);
};

// const StyledSortableGrid = styled(ReactSortable)``;

export default HomePage;

const SortableGridWrapper: React.FC<ReactSortableProps<any>> = (props) => (
	<ReactSortable {...props} />
);

const ChartSection = styled(PrimaryContainer).attrs({
	as: SortableGridWrapper,
})`
	flex: 1 0 90%;
	margin: 0 10px 10px 10px;

	display: grid;
	grid-template-columns: repeat(auto-fill, 50%);
	grid-auto-rows: 480px;
	overflow: hidden;
`;

const DateSlider = styled.div`
	display: flex;
	flex-flow: row;
	justify-content: center;
	align-items: center;
	margin: 10px;
	padding-bottom: 20px;

	.MuiSlider-root {
		height: 15px;
		padding: 10px;
		margin: 0 50px 20px 50px;
		position: relative;
		z-index: 1;
	}

	.MuiSlider-root::before {
		content: "";
		position: absolute;
		top: 0;
		left: -25px;
		right: -25px;
		bottom: 0;
		background: var(--primary-color);
		z-index: -1;
		box-shadow: 5px 5px 4px rgba(0, 0, 0, 0.5);
		border-radius: 15px;
	}

	.MuiSlider-rail::before {
		background: var(--secondary-color);
		content: "";
		position: absolute;
		top: 0;
		left: -20px;
		right: 0;
		bottom: 0;
		border-radius: 15px;
	}

	span {
		font-weight: bold;
		font-size-adjust: max(0.7);
	}
`;

const TimeRangeSection = styled(SecondaryContainer)`
	margin: 10px 10px 25px;
`;

const WeatherSection = styled(PrimaryContainer)`
	margin: 0 10px 0 10px;
	width: 100%;

	h2 {
		padding: 10px 10px 0 15px;
		margin: 0;
	}
`;

const HomePageDiv = styled.div`
	display: flex;
	flex-flow: row;
	flex-wrap: wrap;
`;

const MapsContainer = styled(SecondaryContainer)`
	height: 40vh;
	width: 100vw;
	margin: 20px;
`;
