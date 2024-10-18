using Common.Records;

namespace Common.Services;

public interface IForecastApi
{
	public Task<MetForecast> GetForecastAsync(Position position);
}
