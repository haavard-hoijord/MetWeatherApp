﻿using Backend.Services;
using Common;
using Common.Records;
using Common.Services;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using Newtonsoft.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Tests;

[TestFixture]
public class TidalApiTests
{
	[Test]
	public void TidalWaterParseTest()
	{
		// Arrange
		const string metData = """
			    VANNSTANDSVARSEL --- MET STORMFLO ---

			    SIST OPPDATERT: 20200330 10:05 UTC
			    ==========================================
			    BERGEN
			    ------------------------------
			     AAR MND DAG TIM PROG  SURGE  TIDE   TOTAL  0p     25p    50p    75p    100p
			    2020   3  30   0    0  -0.18   0.30   0.12  -0.18  -0.18  -0.18  -0.18  -0.18
			    2020   3  30   1    1  -0.20   0.36   0.16  -0.20  -0.20  -0.20  -0.20  -0.19
			    2020   3  30   2    2  -0.22   0.31   0.09  -0.22  -0.20  -0.20  -0.20  -0.19
			    2020   3  30   3    3  -0.22   0.16  -0.06  -0.23  -0.22  -0.21  -0.21  -0.20
			    2020   3  30   4    4  -0.22  -0.07  -0.29  -0.23  -0.22  -0.21  -0.21  -0.20
			    2020   3  30   5    5  -0.23  -0.30  -0.53  -0.23  -0.22  -0.21  -0.21  -0.20
			    2020   3  30   6    6  -0.23  -0.45  -0.68  -0.25  -0.23  -0.23  -0.23  -0.22
			    2020   3  30   7    7  -0.23  -0.49  -0.72  -0.24  -0.23  -0.23  -0.23  -0.22
			    2020   3  30   8    8  -0.23  -0.42  -0.65  -0.24  -0.23  -0.23  -0.23  -0.22
			""";

		var mockWeatherApi = new Mock<IWeatherApi<TidalWaterApiEndpoint>>();
		mockWeatherApi.Setup(m => m.GetDataAsync("?harbor=1", "text/plain")).ReturnsAsync(metData);

		var tidalApi = new TidalApi(mockWeatherApi.Object);

		// Act
		var tidalData = tidalApi.GetTidalWaterAsync("1").Result;

		// Assert
		Assert.Multiple(() =>
		{
			Assert.That(tidalData, Is.Not.Null, "Tidal data is null");
			Assert.That(tidalData.Values, Is.Not.Empty, "Tidal data values count is not greater than 0");
			Assert.That(tidalData.Values, Has.Length.EqualTo(9), "Tidal data values count is not 9");
			Assert.That(tidalData.Name, Is.EqualTo("BERGEN"), "Tidal data name is not 'BERGEN'");
			Assert.That(tidalData.LastUpdated, Is.EqualTo(new DateTime(2020, 3, 30, 10, 5, 0)), "Tidal data last updated is not 2020-03-30 10:05");
		});
	}
}
