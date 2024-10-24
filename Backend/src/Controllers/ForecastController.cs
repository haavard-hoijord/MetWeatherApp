using System.ComponentModel.DataAnnotations;
using Common.Records;
using Common.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class ForecastController(IForecastApi forecastApi, IHarborApi harborApi) : Controller
{
	[HttpGet("")]
	[Produces("application/json")]
	[ProducesResponseType(typeof(MetForecast), 200)]
	[ProducesResponseType(typeof(string), 400)]
	public async Task<IActionResult> Forecast(double latitude, double longitude, double? altitude = 0)
	{
		return Ok(await forecastApi.GetForecastAsync(new Position(longitude, latitude, altitude ?? 0)));
	}

	[HttpGet("{harborId}")]
	[Produces("application/json")]
	[ProducesResponseType(typeof(MetForecast), 200)]
	[ProducesResponseType(typeof(string), 400)]
	public async Task<IActionResult> Forecast(string harborId)
	{
		var harbors = await harborApi.GetHarborsAsync();

		if (harbors.All(h => h.Id != harborId))
			return BadRequest("Invalid harbor ID");

		var harbor = harbors.First(h => h.Id == harborId);

		return Ok(await forecastApi.GetForecastAsync(harbor.Position));
	}
}
