using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
	c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
});

builder.Services.AddCors(options =>
{
	options.AddPolicy("CorsPolicy",
		builder => builder
		  .AllowAnyHeader()
		  .AllowAnyMethod()
		  .SetIsOriginAllowed((host) => true)
		  .AllowCredentials()
	.Build());
});

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
	.AddCookie(options =>
	{
		options.Cookie.Name = "AuthCookie";
		options.Cookie.HttpOnly = true;
	});



var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
	c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
});

app.UseCors("CorsPolicy");
app.UseHttpsRedirection();
app.MapControllers();


app.MapFallbackToFile("index.html");

app.Run();

