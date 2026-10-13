const API_BASE_URL = 'http://localhost:5000/api/contactos';

function manejarRespuesta(respuesta) {
    if (!respuesta.ok) {
        return respuesta.json()
            .then(data => {
                let detalle = 'Error en la petición.';
                if (data && data.mensaje) {
                    detalle = data.mensaje;
                } else if (data && data.errors) {
                    detalle = Object.values(data.errors).flat().join(' ');
                }
                throw new Error(detalle);
            })
            .catch(error => {
                if (error.message && error.message !== 'Error en la petición.') {
                    throw error;
                }
                throw new Error(`Error HTTP ${respuesta.status}: ${respuesta.statusText}`);
            });
    }

    if (respuesta.status === 204) {
        return Promise.resolve(null);
    }

    return respuesta.json();
}

window.apiService = {
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
