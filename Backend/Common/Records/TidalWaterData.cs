using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace Common.Records;

public record TidalWaterData(string Name, DateTime LastUpdated, TidalValue[] Values);

public record TidalValue(
	DateTime TimeUtc,
	double Surge, //External factors such as wind and atmospheric pressure
	double Tide, //Gravitational forces from the moon and sun
	double Total, //Sum of Surge and Tide
	[property: JsonProperty("surge_percentile_0")] double P0,
	[property: JsonProperty("surge_percentile_25")] double P25,
	[property: JsonProperty("surge_percentile_50")] double P50,
	[property: JsonProperty("surge_percentile_75")] double P75,
	[property: JsonProperty("surge_percentile_100")] double P100
);
