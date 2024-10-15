using System.Text.Json;
using Backend.Services;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;

namespace Backend;

public class Startup(IConfiguration Configuration)
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
        services.AddHttpClient<ITidalApi, TidalApi>(client =>
        {
            client.BaseAddress = new Uri("https://api.met.no/weatherapi/tidalwater/1.1/");
            client.DefaultRequestHeaders.Add("Accept", "application/json");
        });
    }
}