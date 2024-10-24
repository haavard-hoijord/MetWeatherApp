using Common.Records;

namespace Common.Services;

public interface IHarborApi
{
	Task<List<Harbor>> GetHarborsAsync();
	Task<Harbor?> GetClosestHarborAsync(Position position, double kmMaxDistance = 10);
}
