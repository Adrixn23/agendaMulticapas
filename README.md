# Agenda Multicapas

Aplicación web para gestión de contactos desarrollada con arquitectura multicapas en C# (.NET) y frontend en JavaScript vanilla con Promesas.

## Estructura del Proyecto

* **`Agenda.Domain`**: Entidades (`Contacto`), DTOs con validaciones e interfaces (`IContactoRepository`, `IContactoService`).
* **`Agenda.Data`**: Persistencia en JSON asíncrono con control de concurrencia (`SemaphoreSlim`).
* **`Agenda.Business`**: Reglas de negocio (unicidad de teléfono/correo, filtros y normalización).
* **`Agenda.Api`**: Controladores REST (`ContactosController`), inyección de dependencias y configuración de CORS.
* **`frontend`**: Interfaz de usuario minimalista (`HTML/CSS/JS`) consumiendo la API mediante `fetch` y Promesas.

## Ejecución

### 1. Backend (.NET Web API)
```bash
cd backend/Agenda.Api
dotnet run
```
La API escucha en `http://localhost:5000`.

### 2. Frontend
Abre directamente `frontend/index.html` en el navegador o accede a `http://localhost:5000/index.html`.

## Endpoints de la API (`/api/contactos`)

* `GET /api/contactos`: Lista de contactos (soporta `busqueda` y `categoria`).
* `GET /api/contactos/{id}`: Detalle de un contacto.
* `POST /api/contactos`: Registro de nuevo contacto.
* `PUT /api/contactos/{id}`: Actualización de datos.
* `DELETE /api/contactos/{id}`: Eliminación de contacto.
* `PATCH /api/contactos/{id}/favorito`: Alternar favorito.

## Principios Aplicados

* **SOLID**: Responsabilidad única por capa, inversión de dependencias con interfaces, persistencia desacoplada.
* **CORS**: Habilitado para permitir peticiones cruzadas desde el frontend.
* **Asincronía**: Uso de `Task` / `async` / `await` en C# y Promesas nativas en JavaScript.
