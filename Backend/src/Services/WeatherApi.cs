using System.Net.Http.Headers;
using System.Text.Json;

namespace Backend.Services;

public class WeatherApi<T>(HttpClient httpClient) : IWeatherApi<T> where T : IApiEndpoint, new()
{
    private readonly JsonSerializerOptions _jsonSerializerOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };
    
    public async Task<TG> GetJsonAsync<TG>(string location)
    {
        var response = await httpClient.GetAsync(location);
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<TG>(content, _jsonSerializerOptions) ?? throw new InvalidCastException();
    }

    public async Task<string> GetDataAsync(string location, string type = "text/plain")
    {
        var request = new HttpRequestMessage(HttpMethod.Get, location);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue(type));
        var response = await httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }
}