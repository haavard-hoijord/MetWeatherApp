using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace Common.Records;

public record Position(
	[property: JsonProperty("lat")] double Latitude,
	[property: JsonProperty("long")] double Longitude,
	[property: JsonProperty("alt")] double Altitude = 0
);

public record Location(string Name, string Type, Position Position);
