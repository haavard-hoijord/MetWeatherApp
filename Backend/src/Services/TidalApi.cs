using System.Globalization;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.RegularExpressions;
using Backend.DTOs;
using Microsoft.Extensions.Caching.Memory;

namespace Backend.Services;

public partial class TidalApi(HttpClient httpClient, IMemoryCache cache) : ITidalApi
{
    private static readonly JsonSerializerOptions JsonSerializerOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private static readonly MemoryCacheEntryOptions CacheOptions = new MemoryCacheEntryOptions
    {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
    };

    public async Task<List<IHarbor>> GetHarborsAsync()
    {
        if (cache.TryGetValue("harborCache", out List<IHarbor>? harborData)) return harborData ?? [];

        var response = await httpClient.GetAsync("locations");
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        var harbors = JsonSerializer.Deserialize<LocationsDTO>(content, JsonSerializerOptions);

        harborData = harbors?.Features.Select(s => new Harbor
        {
            Position = new Coordinates(s.Geometry.Coordinates[0], s.Geometry.Coordinates[1]),
            PositionType = s.Geometry.Type,
            Name = s.Title,
            Id = s.Id
        }).Cast<IHarbor>().ToList() ?? [];
        
        cache.Set("harborCache", harborData, CacheOptions);

        return harborData;
    }

    [GeneratedRegex(@"SIST OPPDATERT: (\d{8}) (\d{2}:\d{2}) UTC")]
    private static partial Regex LastUpdatedRegex();

    [GeneratedRegex(@"^\d{4}\s+\d{1,2}\s+\d{1,2}")]
    private static partial Regex DataLineRegex();

    [GeneratedRegex(@"\s+")]
    private static partial Regex DataLineColumnsRegex();

    [GeneratedRegex(@"={10,}\s*(.*?)\s*-{10,}", RegexOptions.Singleline)]
    private static partial Regex NameRegex();

    public async Task<ITidalWaterDTO> GetTidalWaterAsync(string harborId)
    {
        if (cache.TryGetValue($"tidalCache_{harborId}", out ITidalWaterDTO? tidalData)) return tidalData!;

        var request = new HttpRequestMessage(HttpMethod.Get, $"?harbor={harborId}");
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("text/plain"));
        var response = await httpClient.SendAsync(request);

        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var lines = content.Split(["\r\n", "\r", "\n"], StringSplitOptions.RemoveEmptyEntries);

        var name = "";
        DateTime lastUpdated = default;
        List<TidalValue> values = [];

        // Extract the last updated date
        var match = LastUpdatedRegex().Match(content);
        if (match.Success)
        {
            var dateString = match.Groups[1].Value;
            var timeString = match.Groups[2].Value;

            lastUpdated = DateTime.ParseExact($"{dateString} {timeString}", "yyyyMMdd HH:mm",
                CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal);
        }

        // Extract the name using the NameRegex
        var nameMatch = NameRegex().Match(content);
        if (nameMatch.Success)
        {
            name = nameMatch.Groups[1].Value.Trim();
        }

        values.AddRange(lines
            .Select(s => s.Trim())
            .Where(s => DataLineRegex().IsMatch(s))
            .Select(s => DataLineColumnsRegex().Split(s))
            .Select(columns => new TidalValue
            {
                TimeUTC = DateTime.ParseExact(
                    $"{columns[0]}{columns[1].PadLeft(2, '0')}{columns[2].PadLeft(2, '0')} {columns[3].PadLeft(2, '0')}:{columns[4].PadLeft(2, '0')} {lastUpdated:zzz}",
                    "yyyyMMdd HH:mm zzz", CultureInfo.InvariantCulture),
                Surge = double.Parse(columns[5], CultureInfo.InvariantCulture),
                Total = double.Parse(columns[7], CultureInfo.InvariantCulture),
                P0 = double.Parse(columns[8], CultureInfo.InvariantCulture),
                P25 = double.Parse(columns[9], CultureInfo.InvariantCulture),
                P50 = double.Parse(columns[10], CultureInfo.InvariantCulture),
                P75 = double.Parse(columns[11], CultureInfo.InvariantCulture),
                P100 = double.Parse(columns[12], CultureInfo.InvariantCulture)
            }));

        tidalData = new TidalWaterDTO
        {
            Name = name,
            LastUpdated = lastUpdated,
            Values = values.Cast<ITidalValue>().ToList()
        };

        cache.Set($"tidalCache_{harborId}", tidalData, CacheOptions);
        return tidalData;
    }
}