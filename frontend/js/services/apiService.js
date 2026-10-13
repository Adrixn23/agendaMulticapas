const API_BASE_URL = 'http://localhost:5000/api/contactos';

async function manejarRespuesta(respuesta) {
    if (!respuesta.ok) {
        let detalleError = 'Error en la petición.';
        try {
            const data = await respuesta.json();
            if (data && data.mensaje) {
                detalleError = data.mensaje;
            } else if (data && data.errors) {
                detalleError = Object.values(data.errors).flat().join(' ');
            }
        } catch {
            detalleError = `Error HTTP ${respuesta.status}: ${respuesta.statusText}`;
        }
        throw new Error(detalleError);
    }

    if (respuesta.status === 204) {
        return null;
    }

    return await respuesta.json();
}

export const apiService = {
    obtenerTodos(busqueda = '', categoria = '') {
        const params = new URLSearchParams();
        if (busqueda) params.append('busqueda', busqueda);
        if (categoria && categoria !== 'Todos') params.append('categoria', categoria);

        const url = params.toString() ? `${API_BASE_URL}?${params.toString()}` : API_BASE_URL;

        return fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(manejarRespuesta);
    },

    obtenerPorId(id) {
        return fetch(`${API_BASE_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(manejarRespuesta);
    },

    crear(contactoData) {
        return fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(contactoData)
        }).then(manejarRespuesta);
    },

    actualizar(id, contactoData) {
        return fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(contactoData)
        }).then(manejarRespuesta);
    },

    eliminar(id) {
        return fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        }).then(manejarRespuesta);
    },

    alternarFavorito(id) {
        return fetch(`${API_BASE_URL}/${id}/favorito`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json'
            }
        }).then(manejarRespuesta);
    }
};
