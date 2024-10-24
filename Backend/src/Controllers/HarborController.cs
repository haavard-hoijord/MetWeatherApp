using Common.Records;
using Common.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class HarborController(IHarborApi harborApi) : Controller
{
	/// <summary>
	///     Get a list of harbors supported by the api
	/// </summary>
	/// <returns>List of harbors</returns>
	/// <response code="200">Returns a list of harbors</response>
	/// <response code="400">If the request is invalid</response>
	[HttpGet("")]
	[Produces("application/json")]
	[ProducesResponseType(typeof(List<Harbor>), 200)]
	[ProducesResponseType(typeof(string), 400)]
	public async Task<IActionResult> Harbors()
	{
		return Ok(await harborApi.GetHarborsAsync());
	}

	/// <summary>
	///		 Get the closest harbor to a given position
	/// </summary>
	///  <param name="latitude">The latitude of the position to find the closest harbor to</param>
	///  <param name="longitude">The longitude of the position to find the closest harbor to</param>
	///  <param name="altitude">The altitude of the position to find the closest harbor to</param>
	///  <param name="kmMaxDistance">The maximum distance in kilometers to search for a harbor</param>
	///  <returns>Returns the closest harbor to the given position</returns>
	///  <response code="200">Returns the closest harbor to the given position</response>
	///  <response code="400">If the request is invalid</response>
	[HttpGet("closest")]
	[Produces("application/json")]
	[ProducesResponseType(typeof(Harbor), 200)]
	[ProducesResponseType(typeof(string), 400)]
	public async Task<Harbor?> GetClosestHarborAsync(double latitude, double longitude, double altitude = 0, double kmMaxDistance = 10)
	{
		return await harborApi.GetClosestHarborAsync(new Position(latitude, longitude, altitude), kmMaxDistance);
	}
}
