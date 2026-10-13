# Agenda Multicapas - Sistema Web de Gestión de Contactos

Aplicación web desarrollada con arquitectura multicapas (N-Tier Architecture), backend en C# ASP.NET Core Web API y frontend en JavaScript moderno basado en Promesas.

---

## 🏛️ Arquitectura del Sistema

El proyecto implementa una separación estricta de responsabilidades dividida en capas independientes:

```
agendaMulticapas/
│
├── backend/
│   ├── Agenda.Domain/        # Entidades, DTOs, Excepciones e Interfaces
│   ├── Agenda.Data/          # Acceso a datos y persistencia asíncrona
│   ├── Agenda.Business/      # Reglas de negocio y validaciones
│   └── Agenda.Api/           # Controladores REST, configuración CORS e inyección de dependencias
│
└── frontend/
    ├── css/styles.css        # Estilos responsivos de la interfaz de usuario
    ├── js/
    │   ├── services/         # Capa de consumo de API mediante Promesas de JavaScript
    │   ├── ui/               # Capa de presentación y manipulación del DOM
    │   └── app.js            # Controlador principal y orquestador de eventos
    └── index.html            # Estructura semántica de la aplicación web
```

---

## ⚙️ Descripción de las Capas

### 1. Capa de Dominio (`Agenda.Domain`)
- **Entidades:** Modelo central `Contacto` con sus atributos (Nombre, Apellido, Teléfono, Correo, Dirección, Categoría, Favorito, FechaRegistro).
- **DTOs:** Objetos de transferencia de datos con Data Annotations para validación de entrada (`CrearContactoDto`, `ActualizarContactoDto`, `ContactoDto`).
- **Interfaces:** Contratos `IContactoRepository` e `IContactoService` para cumplir con el principio de inversión de dependencias (DIP).
- **Excepciones de Negocio:** Clase `ReglaNegocioException` para el control de validaciones lógicas.

### 2. Capa de Datos (`Agenda.Data`)
- **Implementación:** `ContactoRepository` que implementa `IContactoRepository`.
- **Persistencia:** Almacenamiento asíncrono en formato JSON con inicialización de datos de prueba automáticos.
- **Concurrencia:** Control de lectura y escritura concurrente mediante `SemaphoreSlim`.

### 3. Capa de Negocio (`Agenda.Business`)
- **Implementación:** `ContactoService` que implementa `IContactoService`.
- **Reglas de Negocio:**
  - Validación de unicidad de correo electrónico (no duplicados).
  - Validación de unicidad de número telefónico (no duplicados).
  - Normalización y saneamiento de cadenas de texto.
  - Filtrado y búsqueda por término o categoría.
  - Gestión del estado de favorito.

### 4. Capa de Presentación / API (`Agenda.Api`)
- **Controlador REST:** `ContactosController` con soporte para operaciones CRUD completas y códigos de respuesta HTTP semánticos (200, 201, 400, 404).
- **CORS (Cross-Origin Resource Sharing):** Política configurada en `Program.cs` para admitir peticiones provenientes del cliente web frontend.
- **Inyección de Dependencias:** Registro de servicios en el contenedor IoC nativo de .NET.

### 5. Frontend en Capas y Promesas de JavaScript (`frontend/`)
- **Capa de Servicios (`apiService.js`):** Encapsula todas las llamadas HTTP a la API REST retornando objetos `Promise` nativos mediante `fetch`. Emplea métodos `.then()`, `.catch()` y async/await.
- **Capa de UI (`uiManager.js`):** Gestiona el DOM, renderiza las tarjetas de contactos, modales interactivos, estados de carga y notificaciones toast.
- **Capa de Control (`app.js`):** Coordina los eventos de la vista con las operaciones asíncronas de la capa de servicios.

---

## 🚀 Instrucciones de Ejecución

### Prerrequisitos
- .NET SDK 8.0, 9.0 o 10.0 instalado.
- Cualquier navegador web moderno (Chrome, Edge, Firefox).

### 1. Ejecutar el Backend (API)

Abre una terminal en la raíz del proyecto y ejecuta:

```bash
cd backend/Agenda.Api
dotnet run
```

La API quedará escuchando en:
- `http://localhost:5000`
- `https://localhost:5001`

Endpoints disponibles:
- `GET /api/contactos` - Obtener lista de contactos (soporta parámetros `busqueda` y `categoria`)
- `GET /api/contactos/{id}` - Obtener contacto por identificador
- `POST /api/contactos` - Crear nuevo contacto
- `PUT /api/contactos/{id}` - Actualizar contacto existente
- `DELETE /api/contactos/{id}` - Eliminar contacto
- `PATCH /api/contactos/{id}/favorito` - Alternar estado de favorito

### 2. Ejecutar el Frontend

Puedes abrir directamente el archivo `frontend/index.html` en tu navegador, o servirlo con cualquier servidor estático local (por ejemplo la extensión Live Server de VS Code o mediante terminal).

---

## 📋 Buenas Prácticas Aplicadas
- Principios SOLID (Inversión de dependencias, responsabilidad única).
- Arquitectura desacoplada en proyectos de biblioteca de clases independientes.
- Uso riguroso de Promesas y programación asíncrona (`async` / `await` / `Task`).
- Manejo estandarizado de códigos de estado HTTP y captura de excepciones.
- Sanitización de entradas y escape contra inyecciones XSS en el cliente.
