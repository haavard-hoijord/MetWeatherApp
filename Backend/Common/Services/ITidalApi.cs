using Common.Records;

namespace Common.Services;

public interface ITidalApi
{
	Task<TidalWaterData> GetTidalWaterAsync(string harborId);
}
