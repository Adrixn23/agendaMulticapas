using System.ComponentModel.DataAnnotations;

namespace Agenda.Domain.DTOs;

public class CrearContactoDto
{
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 50 caracteres.")]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "El apellido es obligatorio.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "El apellido debe tener entre 2 y 50 caracteres.")]
    public string Apellido { get; set; } = string.Empty;

    [Required(ErrorMessage = "El teléfono es obligatorio.")]
    [Phone(ErrorMessage = "El formato de teléfono no es válido.")]
    [StringLength(20, ErrorMessage = "El teléfono no puede exceder 20 caracteres.")]
    public string Telefono { get; set; } = string.Empty;

    [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
    [EmailAddress(ErrorMessage = "El formato de correo electrónico no es válido.")]
    [StringLength(100, ErrorMessage = "El correo no puede exceder 100 caracteres.")]
    public string Email { get; set; } = string.Empty;

    [StringLength(150, ErrorMessage = "La dirección no puede exceder 150 caracteres.")]
    public string Direccion { get; set; } = string.Empty;

    [Required(ErrorMessage = "La categoría es obligatoria.")]
    [StringLength(30, ErrorMessage = "La categoría no puede exceder 30 caracteres.")]
    public string Categoria { get; set; } = "General";

    public bool Favorito { get; set; } = false;
}
