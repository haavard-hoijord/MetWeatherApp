using Common.Records;
using Common.Services;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Backend.Utils;

public class HarborOperationFilter(IServiceProvider serviceProvider) : IOperationFilter
{
	public void Apply(OpenApiOperation operation, OperationFilterContext context)
	{
		// Look for specific parameter by name (e.g., harborId)
		var harborIdParam = operation.Parameters.FirstOrDefault(p => p.Name == "harborId");
		if (harborIdParam == null)
			return;

		// Resolve scoped service within operation
		using var scope = serviceProvider.CreateScope();
		var harborApi = scope.ServiceProvider.GetRequiredService<IHarborApi>();

		// Fetch harbor data asynchronously
		var harbors = harborApi.GetHarborsAsync().GetAwaiter().GetResult();

		// Modify parameter to include Enum values (dropdown in Swagger UI)
		harborIdParam.Schema.Enum = harbors.Select(h => new OpenApiString(h.Id)).ToList<IOpenApiAny>();
	}
}
