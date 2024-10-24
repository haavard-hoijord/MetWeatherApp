using System.ComponentModel.DataAnnotations;
using Common.Records;
using Common.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class TidalwaterController(ITidalApi tidalApi) : Controller
{
	/// <summary>
	///     Get tidal water data for a specific harbor
	/// </summary>
	/// <param name="harborId">The harbor to fetch data for</param>
	/// <returns>Returns tidal water data for specific harbor</returns>
	/// <response code="200">Returns tidal water data for specific harbor</response>
	/// <response code="400">If the request is invalid</response>
	[HttpGet("")]
	[Produces("application/json")]
	[ProducesResponseType(typeof(TidalWaterData), 200)]
	[ProducesResponseType(typeof(string), 400)]
	public async Task<IActionResult> TidalWater([Required] string harborId)
	{
		return Ok(await tidalApi.GetTidalWaterAsync(harborId));
	}
}
