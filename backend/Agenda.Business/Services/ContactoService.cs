using Agenda.Domain.DTOs;
using Agenda.Domain.Entities;
using Agenda.Domain.Exceptions;
using Agenda.Domain.Interfaces;

namespace Agenda.Business.Services;

public class ContactoService : IContactoService
{
    private readonly IContactoRepository _repository;

    public ContactoService(IContactoRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ContactoDto>> ObtenerTodosAsync(string? busqueda = null, string? categoria = null)
    {
        var contactos = await _repository.ObtenerTodosAsync();

        if (!string.IsNullOrWhiteSpace(categoria) && !categoria.Equals("Todos", StringComparison.OrdinalIgnoreCase))
        {
            contactos = contactos.Where(c => c.Categoria.Equals(categoria, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(busqueda))
        {
            var termino = busqueda.Trim().ToLowerInvariant();
            contactos = contactos.Where(c =>
                c.Nombre.ToLowerInvariant().Contains(termino) ||
                c.Apellido.ToLowerInvariant().Contains(termino) ||
                c.Email.ToLowerInvariant().Contains(termino) ||
                c.Telefono.ToLowerInvariant().Contains(termino) ||
                c.Direccion.ToLowerInvariant().Contains(termino));
        }

        return contactos.Select(MapearADto);
    }

    public async Task<ContactoDto?> ObtenerPorIdAsync(int id)
    {
        var contacto = await _repository.ObtenerPorIdAsync(id);
        return contacto is null ? null : MapearADto(contacto);
    }

    public async Task<ContactoDto> CrearAsync(CrearContactoDto dto)
    {
        var emailLimpio = dto.Email.Trim().ToLowerInvariant();
        var telefonoLimpio = dto.Telefono.Trim();

        if (await _repository.ExisteEmailAsync(emailLimpio))
        {
            throw new ReglaNegocioException($"Ya existe un contacto con el correo electrónico '{dto.Email}'.");
        }

        if (await _repository.ExisteTelefonoAsync(telefonoLimpio))
        {
            throw new ReglaNegocioException($"Ya existe un contacto con el teléfono '{dto.Telefono}'.");
        }

        var entidad = new Contacto
        {
            Nombre = dto.Nombre.Trim(),
            Apellido = dto.Apellido.Trim(),
            Telefono = telefonoLimpio,
            Email = emailLimpio,
            Direccion = dto.Direccion.Trim(),
            Categoria = string.IsNullOrWhiteSpace(dto.Categoria) ? "General" : dto.Categoria.Trim(),
            Favorito = dto.Favorito
        };

        var creado = await _repository.AgregarAsync(entidad);
        return MapearADto(creado);
    }

    public async Task<bool> ActualizarAsync(int id, ActualizarContactoDto dto)
    {
        var existente = await _repository.ObtenerPorIdAsync(id);
        if (existente is null)
        {
            return false;
        }

        var emailLimpio = dto.Email.Trim().ToLowerInvariant();
        var telefonoLimpio = dto.Telefono.Trim();

        if (await _repository.ExisteEmailAsync(emailLimpio, id))
        {
            throw new ReglaNegocioException($"Ya existe otro contacto con el correo electrónico '{dto.Email}'.");
        }

        if (await _repository.ExisteTelefonoAsync(telefonoLimpio, id))
        {
            throw new ReglaNegocioException($"Ya existe otro contacto con el teléfono '{dto.Telefono}'.");
        }

        existente.Nombre = dto.Nombre.Trim();
        existente.Apellido = dto.Apellido.Trim();
        existente.Telefono = telefonoLimpio;
        existente.Email = emailLimpio;
        existente.Direccion = dto.Direccion.Trim();
        existente.Categoria = string.IsNullOrWhiteSpace(dto.Categoria) ? "General" : dto.Categoria.Trim();
        existente.Favorito = dto.Favorito;

        return await _repository.ActualizarAsync(existente);
    }

    public async Task<bool> EliminarAsync(int id)
    {
        return await _repository.EliminarAsync(id);
    }

    public async Task<bool> AlternarFavoritoAsync(int id)
    {
        var contacto = await _repository.ObtenerPorIdAsync(id);
        if (contacto is null)
        {
            return false;
        }

        contacto.Favorito = !contacto.Favorito;
        return await _repository.ActualizarAsync(contacto);
    }

    private static ContactoDto MapearADto(Contacto c) => new()
    {
        Id = c.Id,
        Nombre = c.Nombre,
        Apellido = c.Apellido,
        Telefono = c.Telefono,
        Email = c.Email,
        Direccion = c.Direccion,
        Categoria = c.Categoria,
        Favorito = c.Favorito,
        FechaRegistro = c.FechaRegistro
    };
}
