using System.ComponentModel.DataAnnotations;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class TidalwaterController(ITidalApi tidalApi) : Controller
{
    /// <summary>
    ///  Get a list of harbors supported by the api
    /// </summary>
    /// <returns>List of harbors</returns>
    /// <response code="200">Returns a list of harbors</response>
    /// <response code="400">If the request is invalid</response>
    [HttpGet("harbors")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(List<IHarbor>), 200)]
    [ProducesResponseType(typeof(string), 400)]
    public async Task<IActionResult> Harbors()
    {
        return Ok(await tidalApi.GetHarborsAsync());
    }
    
    /// <summary>
    /// Get tidal water data for a specific harbor
    /// </summary>
    /// <param name="harborId">The harbor to fetch data for</param>
    /// <returns>Returns tidal water data for specific harbor</returns>
    /// <response code="200">Returns tidal water data for specific harbor</response>
    /// <response code="400">If the request is invalid</response>
    [HttpGet("")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(ITidalWaterDto), 200)]
    [ProducesResponseType(typeof(string), 400)]
    public async Task<IActionResult> TidalWater([Required] string harborId)
    {
        return Ok(await tidalApi.GetTidalWaterAsync(harborId));
    }
}