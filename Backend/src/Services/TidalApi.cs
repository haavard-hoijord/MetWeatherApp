using System.Globalization;
using System.Text.RegularExpressions;
using Common;
using Common.Records;
using Common.Services;

namespace Backend.Services;

public partial class TidalApi(IWeatherApi<TidalWaterApiEndpoint> weatherApi) : ITidalApi
{
	public async Task<TidalWaterData> GetTidalWaterAsync(string harborId)
	{
		var content = await weatherApi.GetDataAsync($"?harbor={harborId}");
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

			lastUpdated = DateTime.ParseExact(
				$"{dateString} {timeString}",
				"yyyyMMdd HH:mm",
				CultureInfo.InvariantCulture,
				DateTimeStyles.AdjustToUniversal
			);
		}

		// Extract the name using the NameRegex
		var nameMatch = NameRegex().Match(content);
		if (nameMatch.Success)
			name = nameMatch.Groups[1].Value.Trim();

		values.AddRange(
			lines
				.Select(s => s.Trim())
				.Where(s => DataLineRegex().IsMatch(s))
				.Select(s => DataLineColumnsRegex().Split(s))
				.Select(columns => new TidalValue(
					TimeUtc: DateTime.ParseExact(
						$"{columns[0]}{columns[1].PadLeft(2, '0')}{columns[2].PadLeft(2, '0')} {columns[3].PadLeft(2, '0')}:{columns[4].PadLeft(2, '0')} {lastUpdated:zzz}",
						"yyyyMMdd HH:mm zzz",
						CultureInfo.InvariantCulture,
						DateTimeStyles.AdjustToUniversal
					),
					Surge: double.Parse(columns[5], CultureInfo.InvariantCulture),
					Tide: double.Parse(columns[6], CultureInfo.InvariantCulture),
					Total: double.Parse(columns[7], CultureInfo.InvariantCulture),
					P0: double.Parse(columns[8], CultureInfo.InvariantCulture),
					P25: double.Parse(columns[9], CultureInfo.InvariantCulture),
					P50: double.Parse(columns[10], CultureInfo.InvariantCulture),
					P75: double.Parse(columns[11], CultureInfo.InvariantCulture),
					P100: double.Parse(columns[12], CultureInfo.InvariantCulture)
				))
		);

		var tidalData = new TidalWaterData(name, lastUpdated, values.ToArray());
		return tidalData;
	}

	[GeneratedRegex(@"SIST OPPDATERT: (\d{8}) (\d{2}:\d{2}) UTC")]
	private static partial Regex LastUpdatedRegex();

	[GeneratedRegex(@"^\d{4}\s+\d{1,2}\s+\d{1,2}")]
	private static partial Regex DataLineRegex();

	[GeneratedRegex(@"\s+")]
	private static partial Regex DataLineColumnsRegex();

	[GeneratedRegex(@"={10,}\s*(.*?)\s*-{10,}", RegexOptions.Singleline)]
	private static partial Regex NameRegex();
}
