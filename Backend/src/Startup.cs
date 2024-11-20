using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using Backend.Services;
using Backend.Utils;
using Common;
using Common.Services;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Backend;

public class Startup(IConfiguration configuration)
{
	public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
	{
		// Configure the HTTP request pipeline.
		if (env.IsDevelopment())
		{
			app.UseSwagger();
			app.UseSwaggerUI();
			app.UseDeveloperExceptionPage();
		}

		app.UseCors();

		app.UseHttpsRedirection();
		app.UseRouting();
		app.UseAuthorization();

		app.UseEndpoints(endpoints =>
		{
			endpoints.MapControllers();
		});
	}

	public void ConfigureServices(IServiceCollection services)
	{
		services.AddCors(options =>
		{
			options.AddDefaultPolicy(builder =>
			{
				builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
			});
		});

		services
			.AddControllers()
			.AddNewtonsoftJson()
			.AddJsonOptions(options =>
			{
				options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
				options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
				options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault;
			});

		// Ensure JsonConvert uses the same settings globally
		JsonConvert.DefaultSettings = () =>
			new JsonSerializerSettings
			{
				ContractResolver = new CamelCasePropertyNamesContractResolver(),
				NullValueHandling = NullValueHandling.Ignore,
				DefaultValueHandling = DefaultValueHandling.Ignore,
			};

		services.AddMemoryCache();

		services.AddAuthorization();
		services.AddEndpointsApiExplorer();

		services.AddScoped<ITidalApi, TidalApi>();
		services.AddScoped<IForecastApi, ForecastApi>();
		services.AddScoped<IHarborApi, HarborApi>();

		var apiEndpointTypes = new List<Type>();
		var entryAssembly = Assembly.GetEntryAssembly();

		if (entryAssembly != null)
		{
			foreach (var assemblyName in entryAssembly.GetReferencedAssemblies())
			{
				var assembly = Assembly.Load(assemblyName);
				apiEndpointTypes.AddRange(
					assembly.GetTypes().Where(t => typeof(IApiEndpoint).IsAssignableFrom(t) && t is { IsClass: true, IsAbstract: false })
				);
			}
		}

		foreach (
			var method in apiEndpointTypes.Select(endpointType =>
				typeof(Startup).GetMethod(nameof(RegisterApiClient))?.MakeGenericMethod(endpointType)
			)
		)
		{
			// Invoke the method to register the ApiClient<TApiEndpoint>
			method?.Invoke(null, [services]);
		}

		services.AddSwaggerGen(c =>
		{
			c.SwaggerDoc("v1", new OpenApiInfo { Title = "WeatherInfo", Version = "v1" });
			c.OperationFilter<HarborOperationFilter>();
		});
	}

	public static void RegisterApiClient<TApiEndpoint>(IServiceCollection services)
		where TApiEndpoint : IApiEndpoint, new()
	{
		// Register HttpClient and the ApiClient<TApiEndpoint> with DI
		services
			.AddHttpClient<WeatherApi<TApiEndpoint>>(client =>
			{
				// Instantiate the TApiEndpoint type and set the base address
				var endpoint = new TApiEndpoint();
				client.BaseAddress = new Uri(Program.BaseUrl + endpoint.EndpointPath);
				client.DefaultRequestHeaders.Add("Accept", "application/json");
			})
			.AddTypedClient<IWeatherApi<TApiEndpoint>>((httpClient, _) => new WeatherApi<TApiEndpoint>(httpClient, _.GetService<IMemoryCache>()!));
	}
}
