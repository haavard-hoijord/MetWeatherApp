using Backend.Services;
using Common;
using Common.Records;
using Common.Services;
using Moq;
using Newtonsoft.Json;

namespace Tests;

[TestFixture]
public class HarborApiTests
{
	[Test]
	public void HarborParseTest()
	{
		// Arrange
		var locationsDto = new
		{
			Features = new[]
			{
				new
				{
					Id = "1",
					Title = "Test Harbor",
					Geometry = new { Coordinates = (double[])[1.0, 1.0], Type = "point" },
					Properties = new { ShortName = "Test", Collection = "Test" },
				},
			},
		};

		var locationsJson = JsonConvert.SerializeObject(locationsDto);

		var mockWeatherApi = new Mock<IWeatherApi<TidalWaterApiEndpoint>>();
		mockWeatherApi.Setup(m => m.GetJsonAsync<MetLocation>("locations"))!.ReturnsAsync(JsonConvert.DeserializeObject<MetLocation>(locationsJson));

		var tidalApi = new HarborApi(mockWeatherApi.Object);

		// Act
		var harbors = tidalApi.GetHarborsAsync().Result;

		// Assert
		Assert.Multiple(() =>
		{
			Assert.That(harbors, Is.Not.Empty, "Harbors count is not greater than 0");
			Assert.That(harbors[0].Id, Is.EqualTo("1"), "Harbor ID is not 1");
			Assert.That(harbors[0].Name, Is.EqualTo("Test Harbor"), "Harbor name is not 'Test Harbor'");
			Assert.That(harbors[0].Type, Is.EqualTo("harbor"), "Harbor type is not 'harbor'");
			Assert.That(harbors[0].PositionType, Is.EqualTo("point"), "Harbor position type is not 'point'");
			Assert.That(harbors[0].Position.Longitude, Is.EqualTo(1.0), "Harbor longitude is not 1.0");
			Assert.That(harbors[0].Position.Latitude, Is.EqualTo(1.0), "Harbor latitude is not 1.0");
		});
	}
}
