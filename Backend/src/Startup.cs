using System.Reflection;
using System.Text.Json;
using Backend.Services;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;

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
        services.AddCors(options => {
            options.AddDefaultPolicy(builder => {
                builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });
        
        services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
            options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        });;

        services.AddMemoryCache();
        
        services.AddAuthorization();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "WeatherInfo", Version = "v1" });
        });

        services.AddScoped<ITidalApi, TidalApi>();
        
        var apiEndpointTypes = Assembly.GetExecutingAssembly()
            .GetTypes()
            .Where(t => typeof(IApiEndpoint).IsAssignableFrom(t) && t is { IsClass: true, IsAbstract: false });

        foreach (var endpointType in apiEndpointTypes)
        {
            // Dynamically create a generic method for RegisterApiClient<TApiEndpoint>
            var method = typeof(Startup).GetMethod(nameof(RegisterApiClient))?.MakeGenericMethod(endpointType);
            
            // Invoke the method to register the ApiClient<TApiEndpoint>
            method?.Invoke(null, [services]);
        }
    }
    
    public static void RegisterApiClient<TApiEndpoint>(IServiceCollection services)
        where TApiEndpoint : IApiEndpoint, new()
    {
        // Register HttpClient and the ApiClient<TApiEndpoint> with DI
        services.AddHttpClient<WeatherApi<TApiEndpoint>>(client =>
        {
            // Instantiate the TApiEndpoint type and set the base address
            var endpoint = new TApiEndpoint();
            client.BaseAddress = new Uri(Program.BaseUrl + endpoint.EndpointPath);
            client.DefaultRequestHeaders.Add("Accept", "application/json");
        }).AddTypedClient<IWeatherApi<TApiEndpoint>>((httpClient, _) => new WeatherApi<TApiEndpoint>(httpClient));
    }

}