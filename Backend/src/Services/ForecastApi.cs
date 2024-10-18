using Common;
using Common.Records;
using Common.Services;
using Microsoft.Extensions.Caching.Memory;

namespace Backend.Services;

public class ForecastApi(IWeatherApi<ForecastApiEndpoint> weatherApi) : IForecastApi
{
	public Task<MetForecast> GetForecastAsync(Position position)
	{
		return weatherApi.GetJsonAsync<MetForecast>(
			$"complete?lat={position.Latitude}&lon={position.Longitude}&altitude={Math.Floor(position.Altitude)}"
		);
		;
	}
}
