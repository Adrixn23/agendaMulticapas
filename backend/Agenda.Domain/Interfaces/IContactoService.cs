using Agenda.Domain.DTOs;

namespace Agenda.Domain.Interfaces;

public interface IContactoService
{
    Task<IEnumerable<ContactoDto>> ObtenerTodosAsync(string? busqueda = null, string? categoria = null);
    Task<ContactoDto?> ObtenerPorIdAsync(int id);
    Task<ContactoDto> CrearAsync(CrearContactoDto dto);
    Task<bool> ActualizarAsync(int id, ActualizarContactoDto dto);
    Task<bool> EliminarAsync(int id);
    Task<bool> AlternarFavoritoAsync(int id);
}
