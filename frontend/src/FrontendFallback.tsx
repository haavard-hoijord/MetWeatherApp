import { AxiosRequestConfig } from "axios";

async function handleFrontendFallback<T>(
	config: AxiosRequestConfig
): Promise<T> {
	const { url, method, data } = config;

	// Forecast fallback
	if (url!.includes("/Forecast")) {
		return (await fetchFromFallback<T>("/Forecast")) as T;
	}

	// Harbor closest fallback
	if (url!.includes("/Harbor/closest")) {
		return (await fetchFromFallback<T>("/Harbor/closest")) as T;
	}

	// Tidalwater fallback
	if (url!.includes("/Tidalwater")) {
		return (await fetchFromFallback<T>("/Tidalwater")) as T;
	}

	return undefined as T;
}

async function fetchFromFallback<T>(endpoint: string): Promise<T> {
	try {
		// Assume fallback JSON is in the `public` directory under `fallback-data.json`
		const response = await fetch(`/fallback-data.json`);
		if (!response.ok) {
			throw new Error(`Failed to fetch fallback data: ${response.statusText}`);
		}

		const fallbackData = await response.json();

		// Check if the requested endpoint exists in the fallback data
		if (!(endpoint in fallbackData)) {
			throw new Error(`No fallback data available for endpoint: ${endpoint}`);
		}

		return fallbackData[endpoint] as T;
	} catch (error) {
		console.error(`Error fetching fallback data for ${endpoint}:`, error);
		throw error; // Propagate the error for caller handling
	}
}

export default handleFrontendFallback;
