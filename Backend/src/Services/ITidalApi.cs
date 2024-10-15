using Backend.DTOs;

namespace Backend.Services;

public interface ITidalApi
{
    Task<List<IHarbor>> GetHarborsAsync();
    Task<ITidalWaterDTO> GetTidalWaterAsync(string harborId);
}