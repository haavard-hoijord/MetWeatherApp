using System.Text.Json.Serialization;

namespace Common.Records;

public record MetLocation([property: JsonPropertyName("features")] MetLocationFeature[] Features);

public record MetLocationFeature(
	[property: JsonPropertyName("geometry")] MetPointGeometry Geometry,
	[property: JsonPropertyName("title")] string Title,
	[property: JsonPropertyName("id")] string Id,
	[property: JsonPropertyName("type")] string Type = "Feature"
);

public record MetPointGeometry(
	[property: JsonPropertyName("coordinates")] double[] Coordinates,
	[property: JsonPropertyName("type")] string Type = "Point"
);
