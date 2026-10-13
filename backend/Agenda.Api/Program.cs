using Agenda.Business.Services;
using Agenda.Data.Repositories;
using Agenda.Domain.Interfaces;

var builder = WebApplication.CreateBuilder(args);

const string CorsPolicy = "AgendaCorsPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
    {
        policy.AllowAnyOrigin()
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

app.MapControllers();

app.Run();
