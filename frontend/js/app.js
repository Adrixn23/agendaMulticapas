let contactosLocales = [];
let idParaEliminar = null;
let temporizadorBusqueda = null;
let categoriaActual = 'Todos';

function cargarContactos() {
    uiManager.mostrarCargando(true);
    const busqueda = uiManager.elementos.inputBusqueda ? uiManager.elementos.inputBusqueda.value.trim() : '';

    return apiService.obtenerTodos(busqueda, categoriaActual)
        .then(contactos => {
            contactosLocales = contactos || [];
            uiManager.renderizarContactos(contactosLocales);
            uiManager.actualizarResumen(contactosLocales);
        })
        .catch(error => {
            uiManager.mostrarToast(
                error.message || 'No se pudo conectar con la API en http://localhost:5000.',
                'error'
            );
            uiManager.renderizarContactos([]);
            uiManager.actualizarResumen([]);
        })
        .finally(() => {
            uiManager.mostrarCargando(false);
        });
}

function manejarGuardarContacto(evento) {
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
                esEdicion ? 'Contacto actualizado.' : 'Contacto guardado.',
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
            uiManager.mostrarToast('Contacto eliminado.', 'success');
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
    }, 250);
}

function limpiarBusqueda() {
    uiManager.elementos.inputBusqueda.value = '';
    uiManager.elementos.btnLimpiarBusqueda.classList.remove('active');
    cargarContactos();
}

function manejarCambioCategoria(evento) {
    const boton = evento.target.closest('.tab-pill');
    if (!boton) return;

    categoriaActual = boton.dataset.category;
    uiManager.activarPestañaCategoria(categoriaActual);
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

    if (uiManager.elementos.categoryTabs) {
        uiManager.elementos.categoryTabs.addEventListener('click', manejarCambioCategoria);
    }

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
    uiManager.inicializar();
    registrarEventos();
    cargarContactos();
});
