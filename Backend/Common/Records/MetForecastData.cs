﻿using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using Internal.Records;
using Newtonsoft.Json;

//JsonPropertyName is used to mark properties to be deserialized with System.text.json
//JsonProperty is used to mark properties to be serialized with Newtonsoft.Json
namespace Common.Records
{
	[JsonObject(MemberSerialization.OptIn)]
	public record MetForecast(
		[property: JsonPropertyName("geometry")] MetPointGeometry Geometry,
		[property: JsonPropertyName("properties")] MetForecastProperties Properties,
		[property: JsonProperty] [property: JsonPropertyName("type")] string Type = "Feature"
	)
	{
		[JsonProperty]
		public MetForecastUnits Units => Properties.Meta.Units;

		[JsonProperty]
		public MetForecastTimeStep[] TimeSteps => Properties.TimeSteps;
	}
}

namespace Internal.Records
{
	public record MetForecastProperties(
		[property: JsonPropertyName("meta")] MetForecastInlineModel Meta,
		[property: JsonPropertyName("timeseries")] MetForecastTimeStep[] TimeSteps
	);

	[JsonObject(MemberSerialization.OptIn)]
	public record MetForecastTimeStep(
		[property: JsonProperty] [property: JsonPropertyName("time")] DateTime Time,
		[property: JsonPropertyName("data")] MetForecastData Data
	)
	{
		[JsonProperty]
		public MetForecastInstantDetails Details => Data.Instant.Details;

		[JsonProperty]
		public string? SymbolCode => Data.Next1Hours?.Summary.SymbolCode;
	};

	public record MetForecastData(
		[property: JsonPropertyName("instant")] MetForecastInstant Instant,
		[property: JsonPropertyName("next_1_hours")] MetForecastTimePeriod? Next1Hours,
		[property: JsonPropertyName("next_6_hours")] MetForecastTimePeriod? Next6Hours,
		[property: JsonPropertyName("next_12_hours")] MetForecastTimePeriod? Next12Hours
	);

	public record MetForecastInstant([property: JsonPropertyName("details")] MetForecastInstantDetails Details);

	public record MetForecastTimePeriod(
		[property: JsonPropertyName("summary")] MetForecastSummary Summary,
		[property: JsonPropertyName("details")] MetForecastTimePeriodDetails Details
	);

	public record MetForecastSummary([property: JsonPropertyName("symbol_code")] string SymbolCode);

	public record MetForecastInstantDetails(
		[property: JsonPropertyName("air_pressure_at_sea_level")] double? AirPressureAtSeaLevel,
		[property: JsonPropertyName("air_temperature")] double? AirTemperature,
		[property: JsonPropertyName("cloud_area_fraction")] double? CloudAreaFraction,
		[property: JsonPropertyName("cloud_area_fraction_high")] double? CloudAreaFractionHigh,
		[property: JsonPropertyName("cloud_area_fraction_low")] double? CloudAreaFractionLow,
		[property: JsonPropertyName("cloud_area_fraction_medium")] double? CloudAreaFractionMedium,
		[property: JsonPropertyName("dew_point_temperature")] double? DewPointTemperature,
		[property: JsonPropertyName("fog_area_fraction")] double? FogAreaFraction,
		[property: JsonPropertyName("relative_humidity")] double? RelativeHumidity,
		[property: JsonPropertyName("wind_from_direction")] double? WindFromDirection,
		[property: JsonPropertyName("wind_speed")] double? WindSpeed,
		[property: JsonPropertyName("wind_speed_of_gust")] double? WindSpeedOfGust
	);

	public record MetForecastTimePeriodDetails(
		[property: JsonPropertyName("air_temperature_max")] double? AirTemperatureMax,
		[property: JsonPropertyName("air_temperature_min")] double? AirTemperatureMin,
		[property: JsonPropertyName("precipitation_amount")] double? PrecipitationAmount,
		[property: JsonPropertyName("precipitation_amount_max")] double? PrecipitationAmountMax,
		[property: JsonPropertyName("precipitation_amount_min")] double? PrecipitationAmountMin,
		[property: JsonPropertyName("probability_of_precipitation")] double? ProbabilityOfPrecipitation,
		[property: JsonPropertyName("probability_of_thunder")] double? ProbabilityOfThunder,
		[property: JsonPropertyName("ultraviolet_index_clear_sky_max")] double? UltravioletIndexClearSkyMax
	);

	public record MetForecastInlineModel(
		[property: JsonPropertyName("units")] MetForecastUnits Units,
		[property: JsonPropertyName("updated_at")] DateTime UpdatedAt
	);

	public record MetForecastUnits(
		[property: JsonPropertyName("air_pressure_at_sea_level")] string? AirPressureAtSeaLevel,
		[property: JsonPropertyName("air_temperature")] string? AirTemperature,
		[property: JsonPropertyName("air_temperature_max")] string? AirTemperatureMax,
		[property: JsonPropertyName("air_temperature_min")] string? AirTemperatureMin,
		[property: JsonPropertyName("cloud_area_fraction")] string? CloudAreaFraction,
		[property: JsonPropertyName("cloud_area_fraction_high")] string? CloudAreaFractionHigh,
		[property: JsonPropertyName("cloud_area_fraction_low")] string? CloudAreaFractionLow,
		[property: JsonPropertyName("cloud_area_fraction_medium")] string? CloudAreaFractionMedium,
		[property: JsonPropertyName("dew_point_temperature")] string? DewPointTemperature,
		[property: JsonPropertyName("fog_area_fraction")] string? FogAreaFraction,
		[property: JsonPropertyName("precipitation_amount")] string? PrecipitationAmount,
		[property: JsonPropertyName("precipitation_amount_max")] string? PrecipitationAmountMax,
		[property: JsonPropertyName("precipitation_amount_min")] string? PrecipitationAmountMin,
		[property: JsonPropertyName("probability_of_precipitation")] string? ProbabilityOfPrecipitation,
		[property: JsonPropertyName("probability_of_thunder")] string? ProbabilityOfThunder,
		[property: JsonPropertyName("relative_humidity")] string? RelativeHumidity,
		[property: JsonPropertyName("ultraviolet_index_clear_sky_max")] string? UltravioletIndexClearSkyMax,
		[property: JsonPropertyName("wind_from_direction")] string? WindFromDirection,
		[property: JsonPropertyName("wind_speed")] string? WindSpeed,
		[property: JsonPropertyName("wind_speed_of_gust")] string? WindSpeedOfGust
	);
}
