using Agenda.Domain.Entities;

namespace Agenda.Domain.Interfaces;

public interface IContactoRepository
{
    Task<IEnumerable<Contacto>> ObtenerTodosAsync();
    Task<Contacto?> ObtenerPorIdAsync(int id);
    Task<Contacto> AgregarAsync(Contacto contacto);
    Task<bool> ActualizarAsync(Contacto contacto);
    Task<bool> EliminarAsync(int id);
    Task<bool> ExisteEmailAsync(string email, int? idExcluir = null);
    Task<bool> ExisteTelefonoAsync(string telefono, int? idExcluir = null);
}
