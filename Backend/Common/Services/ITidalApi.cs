using Common.Records;

namespace Common.Services;

public interface ITidalApi
{
	Task<List<Harbor>> GetHarborsAsync();
	Task<TidalWaterData> GetTidalWaterAsync(string harborId);
}
