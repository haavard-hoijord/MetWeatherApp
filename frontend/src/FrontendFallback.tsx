import { Harbor } from "./types/Harbor";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { TidalWater, TidalWaterValue } from "./types/TidalWater";

async function handleFrontendFallback<T>(
	config: AxiosRequestConfig
): Promise<T> {
	const { url, method, data } = config;

	const urlObject = new URL(url!, "https://localhost");
	const params = urlObject.searchParams;

	// Add more cases for other endpoints
	if (url!.includes("/forecast")) {
		const latitude = parseFloat(params.get("latitude") || "");
		const longitude = parseFloat(params.get("longitude") || "");

		const response: AxiosResponse = await axios.get(
			`/met/weatherapi/locationforecast/2.0/complete?lat=${latitude}&lon=${longitude}`,
			{
				headers: {
					"User-Agent":
						"DemoWeatherApp/1.0 (+https://github.com/haavard-hoijord/MetWeatherApp/)",
				},
				timeout: 10000,
			}
		);
		const rawForcast = response.data;
		const weatherData: WeatherData = {
			units: mapKeysToCamelCase(
				rawForcast.properties.meta.units
			) as WeatherUnits,
			timeSteps: rawForcast.properties.timeseries.map((timeStep: any) => {
				return {
					time: new Date(timeStep.time),
					details: {
						...mapKeysToCamelCase(timeStep.data.instant.details),
						...mapKeysToCamelCase(timeStep.data.next_1_hours?.details),
					},
					symbolCode: timeStep.data.next_1_hours?.summary.symbol_code,
				} as WeatherTimeStep;
			}),
		};
		return weatherData as T;
	}

	if (url!.includes("/harbor/closest")) {
		const response: AxiosResponse = await axios.get(
			"/met/weatherapi/tidalwater/1.1/locations",
			{
				headers: {
					"User-Agent":
						"DemoWeatherApp/1.0 (+https://github.com/haavard-hoijord/MetWeatherApp/)",
				},
				timeout: 10000,
			}
		);

		const locations: {
			features: {
				id: string;
				title: string;
				geometry: { type: string; coordinates: number[] };
			}[];
		} = response.data;

		const harbors: Harbor[] = locations.features.map((location) => {
			return {
				id: location.id,
				name: location.title,
				type: location.geometry.type,
				position: {
					x: location.geometry.coordinates[0],
					y: location.geometry.coordinates[1],
				},
				positionType: "Point",
			};
		});

		const latitude = parseFloat(params.get("latitude") || "");
		const longitude = parseFloat(params.get("longitude") || "");

		const sortedHarbors = harbors.sort((a, b) => {
			const distanceA = GeoDistanceCalculator.Haversine(
				latitude,
				longitude,
				a.position.x,
				a.position.y
			);
			const distanceB = GeoDistanceCalculator.Haversine(
				latitude,
				longitude,
				b.position.x,
				b.position.y
			);
			return distanceA - distanceB;
		});
		return sortedHarbors[0] as T;
	}

	if (url!.includes("/tidalwater")) {
		const harborId = params.get("harbor") || "";
		const tidalWater: TidalWater =
			await TidalWaterService.getTidalWaterAsync(harborId);
		return tidalWater as T;
	}

	return undefined as T;
}

function toCamelCase(key: string): string {
	return key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function mapKeysToCamelCase(obj: any): any {
	if (Array.isArray(obj)) {
		// Recursively process each element in the array
		return obj.map((item) => mapKeysToCamelCase(item));
	} else if (obj !== null && typeof obj === "object") {
		// Process object keys
		return Object.keys(obj).reduce((result, key) => {
			const newKey = toCamelCase(key);
			// Assign the transformed key and recursively process the value
			result[newKey] = mapKeysToCamelCase(obj[key]);
			return result;
		}, {} as any);
	}

	// Return primitive values as-is
	return obj;
}
class GeoDistanceCalculator {
	// Radius of the Earth in kilometers
	private static readonly R = 6371;

	static Haversine(
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number
	): number {
		const rlat1 = this.ToRadians(lat1); // Convert degrees to radians
		const rlat2 = this.ToRadians(lat2); // Convert degrees to radians
		const difflat = rlat2 - rlat1; // Radian difference (latitudes)
		const difflon = this.ToRadians(lon2 - lon1); // Radian difference (longitudes)

		const d =
			2 *
			this.R *
			Math.asin(
				Math.sqrt(
					Math.sin(difflat / 2) * Math.sin(difflat / 2) +
						Math.cos(rlat1) *
							Math.cos(rlat2) *
							Math.sin(difflon / 2) *
							Math.sin(difflon / 2)
				)
			);
		return d;
	}

	private static ToRadians(degrees: number): number {
		return degrees * (Math.PI / 180);
	}
}

class TidalWaterService {
	private static lastUpdatedRegex = /SIST OPPDATERT: (\d{8}) (\d{2}:\d{2}) UTC/;
	private static dataLineRegex = /^\d{4}\s+\d{1,2}\s+\d{1,2}/;
	private static dataLineColumnsRegex = /\s+/;
	private static nameRegex = /={10,}\s*(.*?)\s*-{10,}/s;

	public static async getTidalWaterAsync(
		harborId: string
	): Promise<TidalWater> {
		let response: AxiosResponse | undefined;

		try {
			response = await axios.get(
				`/met/weatherapi/tidalwater/1.1/?harbor=${harborId}`,
				{
					responseType: "text",
					headers: {
						Origin: "http://localhost:5173",
						"User-Agent":
							"DemoWeatherApp/1.0(+https://github.com/haavard-hoijord/MetWeatherApp/)",
					},
					timeout: 10000,
				}
			);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error("Axios error:", error.message);
				console.error("Request was aborted or failed:", error.config);
				if (error.response) {
					console.error(
						"Response:",
						error.response.status,
						error.response.data
					);
				}
			} else {
				console.error("Unexpected error:", error);
			}
		}
		const content = response!.data as string;
		const lines = content
			.split(/\r?\n/)
			.filter((line: string) => line.trim() !== "");

		let name = "";
		let lastUpdated = new Date(0); // Default to Unix epoch
		const values: TidalWaterValue[] = [];

		// Extract the last updated date
		const lastUpdatedMatch = TidalWaterService.lastUpdatedRegex.exec(content);
		if (lastUpdatedMatch) {
			const dateString = lastUpdatedMatch[1];
			const timeString = lastUpdatedMatch[2];

			lastUpdated = TidalWaterService.parseDate(
				`${dateString} ${timeString}`,
				"yyyyMMdd HH:mm"
			);
		}

		// Extract the name using the NameRegex
		const nameMatch = TidalWaterService.nameRegex.exec(content);
		if (nameMatch) {
			name = nameMatch[1].trim();
		}

		// Parse each data line
		lines
			.map((line) => line.trim())
			.filter((line) => TidalWaterService.dataLineRegex.test(line))
			.forEach((line) => {
				const columns = line.split(TidalWaterService.dataLineColumnsRegex);

				if (columns.length >= 13) {
					values.push({
						timeUtc: TidalWaterService.parseDate(
							`${columns[0]}${columns[1].padStart(2, "0")}${columns[2].padStart(2, "0")} ${columns[3].padStart(2, "0")}:${columns[4].padStart(2, "0")} ${lastUpdated.toISOString().slice(-6)}`,
							"yyyyMMdd HH:mm zzz"
						),
						surge: parseFloat(columns[5]),
						tide: parseFloat(columns[6]),
						total: parseFloat(columns[7]),
					});
				}
			});

		return {
			name,
			lastUpdated,
			values,
		};
	}

	private static parseDate(dateStr: string, format: string): Date {
		const map: { [key: string]: number } = {};
		const regex = format
			.replace(/yyyy/, "(\\d{4})")
			.replace(/MM/, "(\\d{2})")
			.replace(/dd/, "(\\d{2})")
			.replace(/HH/, "(\\d{2})")
			.replace(/mm/, "(\\d{2})")
			.replace(/zzz/, "(0\\.\\d{3}Z)?");

		const match = new RegExp(regex).exec(dateStr);
		if (match) {
			format.match(/yyyy|MM|dd|HH|mm|zzz/g)?.forEach((key, i) => {
				map[key] = parseInt(match[i + 1], 10);
			});

			return new Date(
				Date.UTC(map["yyyy"], map["MM"] - 1, map["dd"], map["HH"], map["mm"])
			);
		}

		throw new Error(`Invalid date format: ${dateStr}`);
	}
}

export default handleFrontendFallback;
