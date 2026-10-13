using Agenda.Domain.DTOs;
using Agenda.Domain.Exceptions;
using Agenda.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Agenda.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactosController : ControllerBase
{
    private readonly IContactoService _contactoService;

    public ContactosController(IContactoService contactoService)
    {
        _contactoService = contactoService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ContactoDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ContactoDto>>> ObtenerTodos(
        [FromQuery] string? busqueda,
        [FromQuery] string? categoria)
    {
        var contactos = await _contactoService.ObtenerTodosAsync(busqueda, categoria);
        return Ok(contactos);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ContactoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ContactoDto>> ObtenerPorId(int id)
    {
        var contacto = await _contactoService.ObtenerPorIdAsync(id);
        if (contacto is null)
        {
            return NotFound(new { mensaje = $"No se encontró el contacto con Id {id}." });
        }

        return Ok(contacto);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ContactoDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ContactoDto>> Crear([FromBody] CrearContactoDto dto)
    {
        try
        {
            var creado = await _contactoService.CrearAsync(dto);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = creado.Id }, creado);
        }
        catch (ReglaNegocioException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Actualizar(int id, [FromBody] ActualizarContactoDto dto)
    {
        try
        {
            var actualizado = await _contactoService.ActualizarAsync(id, dto);
            if (!actualizado)
            {
                return NotFound(new { mensaje = $"No se encontró el contacto con Id {id} para actualizar." });
            }

            return Ok(new { mensaje = "Contacto actualizado correctamente." });
        }
        catch (ReglaNegocioException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Eliminar(int id)
    {
        var eliminado = await _contactoService.EliminarAsync(id);
        if (!eliminado)
        {
            return NotFound(new { mensaje = $"No se encontró el contacto con Id {id} para eliminar." });
        }

        return Ok(new { mensaje = "Contacto eliminado correctamente." });
    }

    [HttpPatch("{id:int}/favorito")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AlternarFavorito(int id)
    {
        var resultado = await _contactoService.AlternarFavoritoAsync(id);
        if (!resultado)
        {
            return NotFound(new { mensaje = $"No se encontró el contacto con Id {id}." });
        }

        return Ok(new { mensaje = "Estado de favorito modificado correctamente." });
    }
}
