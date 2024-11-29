import { Page } from "../types/Page";
import { APIProvider } from "@vis.gl/react-google-maps";
import MapComponent from "../components/MapComponent.tsx";
import React, { useEffect, useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
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
import { useTranslation } from "react-i18next";
import PrecipitationChart from "../components/charts/PrecipitationChart.tsx";
import HumidityChart from "../components/charts/HumidityChart.tsx";
import AirPressureChart from "../components/charts/AirPressureChart.tsx";
import handleFrontendFallback from "../FrontendFallback.tsx";

export const google_api_key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const debug = import.meta.env.MODE === "development";
let isBackendAvailable = !debug;

const HomePage = ({ setError, setLoading, loading, apiUrl }: Page) => {
	const { t } = useTranslation();
	const theme = useTheme();

	const [location, setLocation] = useState<google.maps.places.Place>(() => {
		const savedLocation = localStorage.getItem("location");
		return savedLocation ? JSON.parse(savedLocation) : undefined;
	});
	const [_, setPosition] = useState<{ lat: number; lng: number }>({
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

	const api = axios.create({
		baseURL: `${apiUrl}`, // Backend base URL
		timeout: 5000, // Adjust as needed
	});

	// Interceptor for handling errors
	api.interceptors.response.use(
		(response) => {
			// Reset the flag if the backend responds successfully
			isBackendAvailable = true;
			return response;
		},
		async (error) => {
			if (!error.response) {
				console.warn("Backend unavailable, using frontend fallback.");
				isBackendAvailable = false; // Toggle to fallback globally
				const frontendFallback = handleFrontendFallback(error.config);
				return Promise.resolve({ data: frontendFallback });
			}

			return Promise.reject(error); // Let other errors pass through
		}
	);

	const fetchInfo = async (pos: { lat: number; lng: number }) => {
		try {
			const response = await fetchData<Harbor>({
				url: `/harbor/closest?latitude=${pos.lat}&longitude=${pos.lng}`,
				method: "GET",
			});
			const harbor: Harbor = response!.data as Harbor;
			setClosestHarbor(harbor);

			if (harbor && harbor.id) {
				const tidalResponse = await fetchData<TidalWater>({
					url: `/tidalwater?harbor=${harbor.id}`,
					method: "GET",
				});
				const tidalWater: TidalWater = tidalResponse!.data as TidalWater;
				setTidalData(tidalWater);
			}

			const weatherResponse = await fetchData<WeatherData>({
				url: `/forecast?latitude=${pos.lat}&longitude=${pos.lng}`,
				method: "GET",
			});
			const weather = weatherResponse!.data as WeatherData;
			setWeatherData(weather);
		} catch (err: any) {
			console.error(err.message);
			setError(err.message);
		}
	};

	async function fetchData<T>(
		config: AxiosRequestConfig
	): Promise<AxiosResponse<T> | undefined> {
		if (!isBackendAvailable) {
			// Use fallback data if the backend is unavailable
			const fallbackData: T = await handleFrontendFallback<T>(config);
			if (fallbackData) {
				return {
					data: fallbackData,
					status: 200,
					statusText: "OK",
					headers: {},
					config,
				} as AxiosResponse<T>;
			}

			console.error("No fallback data available");
		} else if (api) {
			try {
				// Attempt to fetch from the backend
				return await api.request<T>(config);
			} catch (error: any) {
				if (axios.isAxiosError(error)) {
					console.error("Failed to fetch:", error.message);
				} else {
					console.error("Unexpected error:", (error as Error).message);
				}
			}
		}
	}

	type locFunc = {
		lat: () => number;
		lng: () => number;
	};

	type locNumber = {
		lat: number;
		lng: number;
	};

	useEffect(() => {
		setTidalData(undefined);
		setWeatherData(undefined);
		setClosestHarbor(undefined);

		if (!location) return;

		const loc = location?.location as locFunc | locNumber;
		let pos: { lng: number; lat: number };

		if (
			typeof location?.location?.["lat"] === "function" &&
			typeof location?.location?.["lng"] === "function"
		) {
			pos = {
				lat: parseFloat((loc as locFunc).lat().toFixed(4) ?? "0"),
				lng: parseFloat((loc as locFunc).lng().toFixed(4) ?? "0"),
			};
		} else {
			pos = {
				lat: parseFloat((loc as locNumber).lat.toFixed(4) ?? "0"),
				lng: parseFloat((loc as locNumber).lng.toFixed(4) ?? "0"),
			};
		}
		setPosition(pos);
		fetchInfo(pos).then((_) => {});
	}, [location]);

	type chartEntry = {
		id: string;
		component: React.ComponentType<any>;
	};

	const allCharts: chartEntry[] = [
		{
			id: "temperature-chart",
			component: TemperatureChart,
		},
		{
			id: "tidal-chart",
			component: TidalChart,
		},
		{
			id: "wind-speed-chart",
			component: WindSpeedChart,
		},
		{
			id: "cloud-coverage-chart",
			component: CloudCoverageChart,
		},
		{
			id: "air-pressure-chart",
			component: AirPressureChart,
		},
		{
			id: "humidity-chart",
			component: HumidityChart,
		},
		{
			id: "precipitation-chart",
			component: PrecipitationChart,
		},
	];

	const [chartOrder, setChartOrder] = useState(() => {
		const savedOrder = localStorage.getItem("chartOrder")
			? JSON.parse(localStorage.getItem("chartOrder")!)
			: [];
		return [
			...savedOrder
				.map((id: any) => allCharts.find((chart) => chart.id === id))
				.filter(Boolean),
			...allCharts.filter((chart) => !savedOrder.includes(chart.id)), // Append new charts
		];
	});

	// Save order to localStorage whenever chartOrder changes
	useEffect(() => {
		const ids = chartOrder.map((chart: any) => chart.id);
		localStorage.setItem("chartOrder", JSON.stringify(ids));
	}, [chartOrder]);
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
					<MapComponent setLocation={setLocation} setLoading={setLoading} />
				</APIProvider>
			</MapsContainer>
			<WeatherSection>
				<TimeRangeSection>
					<h2>{t("timeRange")}</h2>
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
							valueLabelFormat={(value: number, _: number) => {
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
				{chartOrder.map((chart: chartEntry) => {
					const ChartComponent = chart.component;
					return (
						<ChartComponent
							key={chart.id}
							data={chart.id === "tidal-chart" ? tidalData : weatherData}
							timeRange={timeRange}
							harbor={closestHarbor}
						/>
					);
				})}
			</ChartSection>
		</HomePageDiv>
	);
};

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

	@media (max-width: 1000px) {
		grid-template-columns: repeat(auto-fill, 100%);
	}
	grid-auto-rows: 480px;
	overflow: hidden;
`;

// noinspection CssUnusedSymbol
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
