using Backend.Utils;
using Common;
using Common.Records;
using Common.Services;

namespace Backend.Services;

public class HarborApi(IWeatherApi<TidalWaterApiEndpoint> weatherApi) : IHarborApi
{
	public async Task<List<Harbor>> GetHarborsAsync()
	{
		var harbors = await weatherApi.GetJsonAsync<MetLocation>("locations");

		var harborData = harbors
			.Features.Select(s => new Harbor(s.Id, s.Title, new Position(s.Geometry.Coordinates[1], s.Geometry.Coordinates[0]), s.Geometry.Type))
			.ToList();

		return harborData;
	}

	//Get closest harbor within 10km
	public async Task<Harbor?> GetClosestHarborAsync(Position position, double kmMaxDistance = 10)
	{
		var harbors = await GetHarborsAsync();
		var closest = harbors
			.Where(s =>
				GeoDistanceCalculator.Haversine(position.Latitude, position.Longitude, s.Position.Latitude, s.Position.Longitude) <= kmMaxDistance
				|| true
			)
			.OrderBy(s => GeoDistanceCalculator.Haversine(position.Latitude, position.Longitude, s.Position.Latitude, s.Position.Longitude))
			.FirstOrDefault();

		return closest;
	}
}
