type WeatherData = {
	units: WeatherUnits;
	timeSteps: WeatherTimeStep[];
};

type WeatherTimeStep = {
	time: Date;
	details: WeatherDetails;
	symbolCode: string;
};

type WeatherDetails = {
	airPressureAtSeaLevel: number;
	airTemperature: number;
	cloudAreaFraction: number;
	cloudAreaFractionHigh: number;
	cloudAreaFractionLow: number;
	cloudAreaFractionMedium: number;
	dewPointTemperature: number;
	fogAreaFraction: number;
	relativeHumidity: number;
	windFromDirection: number;
	windSpeed: number;
	windSpeedOfGust: number;
	airTemperatureMax: number;
	airTemperatureMin: number;
	precipitationAmount: number;
	precipitationAmountMax: number;
	precipitationAmountMin: number;
	probabilityOfPrecipitation: number;
	probabilityOfThunder: number;
	ultravioletIndexClearSky: number;
};

type WeatherUnits = {
	airPressureAtSeaLevel: string;
	airTemperature: string;
	airTemperatureMax: string;
	airTemperatureMin: string;
	cloudAreaFraction: string;
	cloudAreaFractionHigh: string;
	cloudAreaFractionLow: string;
	cloudAreaFractionMedium: string;
	dewPointTemperature: string;
	fogAreaFraction: string;
	precipitationAmount: string;
	precipitationAmountMax: string;
	precipitationAmountMin: string;
	probabilityOfPrecipitation: string;
	probabilityOfThunder: string;
	relativeHumidity: string;
	ultravioletIndexClearSky: string;
	windSpeed: string;
	windSpeedOfGust: string;
};
