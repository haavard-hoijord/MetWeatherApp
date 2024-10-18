namespace Common.Services;

public interface IWeatherApi<T>
    where T : IApiEndpoint, new()
{
    public Task<TG> GetJsonAsync<TG>(string location);
    public Task<string> GetDataAsync(string location, string type = "text/plain");
}
