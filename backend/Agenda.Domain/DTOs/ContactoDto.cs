namespace Agenda.Domain.DTOs;

public class ContactoDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public bool Favorito { get; set; }
    public DateTime FechaRegistro { get; set; }
}
