import { apiService } from './services/apiService.js';
import { uiManager } from './ui/uiManager.js';

let contactosLocales = [];
let idParaEliminar = null;
let temporizadorBusqueda = null;

async function cargarContactos() {
    uiManager.mostrarCargando(true);
    const busqueda = uiManager.elementos.inputBusqueda.value.trim();
    const categoria = uiManager.elementos.selectCategoriaFiltro.value;

    try {
        contactosLocales = await apiService.obtenerTodos(busqueda, categoria);
        uiManager.renderizarContactos(contactosLocales);
        uiManager.actualizarEstadisticas(contactosLocales);
    } catch (error) {
        uiManager.mostrarToast(error.message || 'Error al conectar con la API.', 'error');
        uiManager.renderizarContactos([]);
    } finally {
        uiManager.mostrarCargando(false);
    }
}

async function manejarGuardarContacto(evento) {
    evento.preventDefault();
    const datos = uiManager.obtenerDatosFormulario();

    if (!uiManager.validarFormulario(datos)) {
        return;
    }

    const esEdicion = Boolean(datos.id);
    const btnGuardar = document.getElementById('btnGuardarContacto');
    const textoOriginal = btnGuardar.textContent;
    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Guardando...';

    const payload = {
        nombre: datos.nombre,
        apellido: datos.apellido,
        telefono: datos.telefono,
        email: datos.email,
        direccion: datos.direccion,
        categoria: datos.categoria,
        favorito: datos.favorito
    };

    const promesaOperacion = esEdicion
        ? apiService.actualizar(datos.id, payload)
        : apiService.crear(payload);

    promesaOperacion
        .then(() => {
            uiManager.cerrarModal();
            uiManager.mostrarToast(
                esEdicion ? 'Contacto actualizado correctamente.' : 'Contacto creado correctamente.',
                'success'
            );
            return cargarContactos();
        })
        .catch(error => {
            uiManager.mostrarToast(error.message, 'error');
        })
        .finally(() => {
            btnGuardar.disabled = false;
            btnGuardar.textContent = textoOriginal;
        });
}

function manejarAccionesLista(evento) {
    const boton = evento.target.closest('button');
    if (!boton) return;

    const accion = boton.dataset.action;
    const id = parseInt(boton.dataset.id, 10);
    if (!id) return;

    if (accion === 'edit') {
        const contacto = contactosLocales.find(c => c.id === id);
        if (contacto) {
            uiManager.abrirModal('editar', contacto);
        } else {
            apiService.obtenerPorId(id)
                .then(c => uiManager.abrirModal('editar', c))
                .catch(err => uiManager.mostrarToast(err.message, 'error'));
        }
    } else if (accion === 'delete') {
        const contacto = contactosLocales.find(c => c.id === id);
        idParaEliminar = id;
        uiManager.abrirModalConfirmar(contacto ? `${contacto.nombre} ${contacto.apellido}` : `#${id}`);
    } else if (accion === 'toggle-fav') {
        boton.disabled = true;
        apiService.alternarFavorito(id)
            .then(() => cargarContactos())
            .catch(err => uiManager.mostrarToast(err.message, 'error'))
            .finally(() => {
                boton.disabled = false;
            });
    }
}

function confirmarEliminar() {
    if (!idParaEliminar) return;

    const btnConfirmar = uiManager.elementos.btnAceptarEliminar;
    btnConfirmar.disabled = true;
    btnConfirmar.textContent = 'Eliminando...';

    apiService.eliminar(idParaEliminar)
        .then(() => {
            uiManager.cerrarModalConfirmar();
            uiManager.mostrarToast('Contacto eliminado correctamente.', 'success');
            idParaEliminar = null;
            return cargarContactos();
        })
        .catch(error => {
            uiManager.mostrarToast(error.message, 'error');
        })
        .finally(() => {
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = 'Eliminar';
        });
}

function manejarInputBusqueda() {
    const valor = uiManager.elementos.inputBusqueda.value.trim();
    uiManager.elementos.btnLimpiarBusqueda.classList.toggle('active', valor.length > 0);

    clearTimeout(temporizadorBusqueda);
    temporizadorBusqueda = setTimeout(() => {
        cargarContactos();
    }, 300);
}

function limpiarBusqueda() {
    uiManager.elementos.inputBusqueda.value = '';
    uiManager.elementos.btnLimpiarBusqueda.classList.remove('active');
    cargarContactos();
}

function registrarEventos() {
    uiManager.elementos.btnNuevoContacto.addEventListener('click', () => {
        uiManager.abrirModal('crear');
    });

    uiManager.elementos.btnCerrarModal.addEventListener('click', () => {
        uiManager.cerrarModal();
    });

    uiManager.elementos.btnCancelarModal.addEventListener('click', () => {
        uiManager.cerrarModal();
    });

    uiManager.elementos.modalContacto.addEventListener('click', evento => {
        if (evento.target === uiManager.elementos.modalContacto) {
            uiManager.cerrarModal();
        }
    });

    uiManager.elementos.formContacto.addEventListener('submit', manejarGuardarContacto);

    uiManager.elementos.listaContactos.addEventListener('click', manejarAccionesLista);

    uiManager.elementos.btnAceptarEliminar.addEventListener('click', confirmarEliminar);

    uiManager.elementos.btnCancelarEliminar.addEventListener('click', () => {
        idParaEliminar = null;
        uiManager.cerrarModalConfirmar();
    });

    uiManager.elementos.btnCerrarConfirmar.addEventListener('click', () => {
        idParaEliminar = null;
        uiManager.cerrarModalConfirmar();
    });

    uiManager.elementos.modalConfirmar.addEventListener('click', evento => {
        if (evento.target === uiManager.elementos.modalConfirmar) {
            idParaEliminar = null;
            uiManager.cerrarModalConfirmar();
        }
    });

    uiManager.elementos.inputBusqueda.addEventListener('input', manejarInputBusqueda);
    uiManager.elementos.btnLimpiarBusqueda.addEventListener('click', limpiarBusqueda);

    uiManager.elementos.selectCategoriaFiltro.addEventListener('change', () => {
        cargarContactos();
    });

    document.addEventListener('keydown', evento => {
        if (evento.key === 'Escape') {
            if (!uiManager.elementos.modalContacto.classList.contains('hidden')) {
                uiManager.cerrarModal();
            }
            if (!uiManager.elementos.modalConfirmar.classList.contains('hidden')) {
                idParaEliminar = null;
                uiManager.cerrarModalConfirmar();
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    registrarEventos();
    cargarContactos();
});
