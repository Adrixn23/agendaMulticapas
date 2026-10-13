using System.Text.Json;
using Agenda.Domain.Entities;
using Agenda.Domain.Interfaces;

namespace Agenda.Data.Repositories;

public class ContactoRepository : IContactoRepository
{
    private readonly string _filePath;
    private readonly SemaphoreSlim _semaphore = new(1, 1);
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        WriteIndented = true,
        PropertyNameCaseInsensitive = true
    };

    public ContactoRepository(string? customPath = null)
    {
        var baseDir = AppContext.BaseDirectory;
        _filePath = customPath ?? Path.Combine(baseDir, "contactos.json");
        InicializarAlmacen();
    }

    private void InicializarAlmacen()
    {
        if (File.Exists(_filePath)) return;

        var datosIniciales = new List<Contacto>
        {
            new()
            {
                Id = 1,
                Nombre = "Carlos",
                Apellido = "Brito",
                Telefono = "+58 412 1234567",
                Email = "carlos.brito@example.com",
                Direccion = "Av. Principal #123",
                Categoria = "Trabajo",
                Favorito = true,
                FechaRegistro = DateTime.UtcNow.AddDays(-10)
            },
            new()
            {
                Id = 2,
                Nombre = "María",
                Apellido = "González",
                Telefono = "+58 414 9876543",
                Email = "maria.gonzalez@example.com",
                Direccion = "Calle Los Pinos #45",
                Categoria = "Familia",
                Favorito = false,
                FechaRegistro = DateTime.UtcNow.AddDays(-5)
            },
            new()
            {
                Id = 3,
                Nombre = "Alejandro",
                Apellido = "Rodríguez",
                Telefono = "+58 424 5558899",
                Email = "alejandro.r@example.com",
                Direccion = "Urb. El Bosque Edif. 4",
                Categoria = "Amigos",
                Favorito = true,
                FechaRegistro = DateTime.UtcNow.AddDays(-2)
            }
        };

        var json = JsonSerializer.Serialize(datosIniciales, _jsonOptions);
        File.WriteAllText(_filePath, json);
    }

    private async Task<List<Contacto>> LeerDatosInternosAsync()
    {
        if (!File.Exists(_filePath))
        {
            return new List<Contacto>();
        }

        var json = await File.ReadAllTextAsync(_filePath);
        return JsonSerializer.Deserialize<List<Contacto>>(json, _jsonOptions) ?? new List<Contacto>();
    }

    private async Task GuardarDatosInternosAsync(List<Contacto> contactos)
    {
        var json = JsonSerializer.Serialize(contactos, _jsonOptions);
        await File.WriteAllTextAsync(_filePath, json);
    }

    public async Task<IEnumerable<Contacto>> ObtenerTodosAsync()
    {
        await _semaphore.WaitAsync();
        try
        {
            var contactos = await LeerDatosInternosAsync();
            return contactos.OrderByDescending(c => c.Favorito).ThenBy(c => c.Nombre).ToList();
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task<Contacto?> ObtenerPorIdAsync(int id)
    {
        await _semaphore.WaitAsync();
        try
        {
            var contactos = await LeerDatosInternosAsync();
            return contactos.FirstOrDefault(c => c.Id == id);
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task<Contacto> AgregarAsync(Contacto contacto)
    {
        await _semaphore.WaitAsync();
        try
        {
            var contactos = await LeerDatosInternosAsync();
            var nuevoId = contactos.Count > 0 ? contactos.Max(c => c.Id) + 1 : 1;
            contacto.Id = nuevoId;
            contacto.FechaRegistro = DateTime.UtcNow;

            contactos.Add(contacto);
            await GuardarDatosInternosAsync(contactos);

            return contacto;
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task<bool> ActualizarAsync(Contacto contacto)
    {
        await _semaphore.WaitAsync();
        try
        {
            var contactos = await LeerDatosInternosAsync();
            var indice = contactos.FindIndex(c => c.Id == contacto.Id);
            if (indice == -1) return false;

            contactos[indice] = contacto;
            await GuardarDatosInternosAsync(contactos);
            return true;
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task<bool> EliminarAsync(int id)
    {
        await _semaphore.WaitAsync();
        try
        {
            var contactos = await LeerDatosInternosAsync();
            var elemento = contactos.FirstOrDefault(c => c.Id == id);
            if (elemento is null) return false;

            contactos.Remove(elemento);
            await GuardarDatosInternosAsync(contactos);
            return true;
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task<bool> ExisteEmailAsync(string email, int? idExcluir = null)
    {
        await _semaphore.WaitAsync();
        try
        {
            var contactos = await LeerDatosInternosAsync();
            return contactos.Any(c =>
                c.Email.Equals(email.Trim(), StringComparison.OrdinalIgnoreCase) &&
                (!idExcluir.HasValue || c.Id != idExcluir.Value));
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task<bool> ExisteTelefonoAsync(string telefono, int? idExcluir = null)
    {
        await _semaphore.WaitAsync();
        try
        {
            var contactos = await LeerDatosInternosAsync();
            var telefonoLimpio = LimpiarTelefono(telefono);

            return contactos.Any(c =>
                LimpiarTelefono(c.Telefono).Equals(telefonoLimpio, StringComparison.OrdinalIgnoreCase) &&
                (!idExcluir.HasValue || c.Id != idExcluir.Value));
        }
        finally
        {
            _semaphore.Release();
        }
    }

    private static string LimpiarTelefono(string tel)
    {
        return new string(tel.Where(char.IsDigit).ToArray());
    }
}
