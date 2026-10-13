using Agenda.Business.Services;
using Agenda.Data.Repositories;
using Agenda.Domain.Interfaces;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

const string CorsPolicy = "AgendaCorsPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddSingleton<IContactoRepository, ContactoRepository>();
builder.Services.AddScoped<IContactoService, ContactoService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.UseCors(CorsPolicy);

var frontendPath = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, "..", "..", "frontend"));
if (Directory.Exists(frontendPath))
{
    app.UseDefaultFiles(new DefaultFilesOptions
    {
        FileProvider = new PhysicalFileProvider(frontendPath),
        RequestPath = ""
    });
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(frontendPath),
        RequestPath = ""
    });
}

app.MapControllers();

app.Run();
