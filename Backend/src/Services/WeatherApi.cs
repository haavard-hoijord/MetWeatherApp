using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using Common;
using Common.Services;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;

namespace Backend.Services;

public class WeatherApi<T>(HttpClient httpClient, IMemoryCache cache) : IWeatherApi<T>
	where T : IApiEndpoint, new()
{
	private readonly JsonSerializerOptions _jsonSerializerOptions =
		new() { PropertyNameCaseInsensitive = true, DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull };

	public async Task<TG> GetJsonAsync<TG>(string location)
	{
		var response = await PerformRequest(location);
		var content = await response.Content.ReadAsStringAsync();
		return JsonSerializer.Deserialize<TG>(content, _jsonSerializerOptions) ?? throw new InvalidCastException();
	}

	public async Task<string> GetDataAsync(string location, string type = "text/plain")
	{
		var response = await PerformRequest(location, type);
		return await response.Content.ReadAsStringAsync();
	}

	private async Task<HttpResponseMessage> PerformRequest(string location, string accepts = "application/json")
	{
		if (cache.TryGetValue(location, out HttpResponseMessage? cachedResponse))
		{
			var compareTo = cachedResponse?.Headers.Date?.Add(TimeSpan.FromMinutes(30)).CompareTo(new DateTimeOffset());

			if (compareTo >= 0)
			{
				var headRequest = new HttpRequestMessage(HttpMethod.Head, location);
				AddUserAgent(headRequest);
				headRequest.Headers.IfModifiedSince = cachedResponse?.Content.Headers.LastModified;
				var headResponse = await httpClient.SendAsync(headRequest);

				if (headResponse.StatusCode == HttpStatusCode.NotModified)
				{
					return cachedResponse!;
				}

				cache.Remove(location);
			}
			else
			{
				return cachedResponse!;
			}
		}

		var request = new HttpRequestMessage(HttpMethod.Get, location);
		request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue(accepts));
		AddUserAgent(request);
		var response = await httpClient.SendAsync(request);
		response.EnsureSuccessStatusCode();

		var cacheEntryOptions = new MemoryCacheEntryOptions
		{
			AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1),
			SlidingExpiration = TimeSpan.FromHours(1),
		};
		cache.Set(location, response, cacheEntryOptions);

		return response;
	}

	private static void AddUserAgent(HttpRequestMessage request)
	{
		request.Headers.UserAgent.Add(new ProductInfoHeaderValue("BouvetDemoWeatherApp", "1.0"));
		request.Headers.UserAgent.Add(new ProductInfoHeaderValue("(+https://github.com/haavard-hoijord/TidalWaterPracticeProject)"));
	}
}
