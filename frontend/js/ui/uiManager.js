function escaparHtml(cadena) {
    if (!cadena) return '';
    return String(cadena)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

window.uiManager = {
    elementos: {},

    inicializar() {
        this.elementos = {
            listaContactos: document.getElementById('listaContactos'),
            loader: document.getElementById('loader'),
            emptyState: document.getElementById('emptyState'),
            modalContacto: document.getElementById('modalContacto'),
            formContacto: document.getElementById('formContacto'),
            modalTitulo: document.getElementById('modalTitulo'),
            contactoId: document.getElementById('contactoId'),
            inputNombre: document.getElementById('inputNombre'),
            inputApellido: document.getElementById('inputApellido'),
            inputTelefono: document.getElementById('inputTelefono'),
            inputEmail: document.getElementById('inputEmail'),
            inputDireccion: document.getElementById('inputDireccion'),
            selectCategoria: document.getElementById('selectCategoria'),
            checkFavorito: document.getElementById('checkFavorito'),
            btnNuevoContacto: document.getElementById('btnNuevoContacto'),
            btnCerrarModal: document.getElementById('btnCerrarModal'),
            btnCancelarModal: document.getElementById('btnCancelarModal'),
            inputBusqueda: document.getElementById('inputBusqueda'),
            btnLimpiarBusqueda: document.getElementById('btnLimpiarBusqueda'),
            selectCategoriaFiltro: document.getElementById('selectCategoriaFiltro'),
            modalConfirmar: document.getElementById('modalConfirmar'),
            confirmarMensaje: document.getElementById('confirmarMensaje'),
            btnAceptarEliminar: document.getElementById('btnAceptarEliminar'),
            btnCancelarEliminar: document.getElementById('btnCancelarEliminar'),
            btnCerrarConfirmar: document.getElementById('btnCerrarConfirmar'),
            toastContainer: document.getElementById('toastContainer'),
            statTotal: document.getElementById('statTotal'),
            statFavoritos: document.getElementById('statFavoritos'),
            statTrabajo: document.getElementById('statTrabajo'),
            statFamilia: document.getElementById('statFamilia'),
            statAmigos: document.getElementById('statAmigos')
        };
    },

    mostrarCargando(mostrar = true) {
        if (!this.elementos.loader) return;
        if (mostrar) {
            this.elementos.loader.classList.remove('hidden');
            this.elementos.listaContactos.classList.add('hidden');
            this.elementos.emptyState.classList.add('hidden');
        } else {
            this.elementos.loader.classList.add('hidden');
            this.elementos.listaContactos.classList.remove('hidden');
        }
    },

    renderizarContactos(contactos) {
        if (!this.elementos.listaContactos) return;
        this.elementos.listaContactos.innerHTML = '';

        if (!contactos || contactos.length === 0) {
            this.elementos.emptyState.classList.remove('hidden');
            return;
        }

        this.elementos.emptyState.classList.add('hidden');

        const fragment = document.createDocumentFragment();

        contactos.forEach(contacto => {
            const card = document.createElement('article');
            card.className = `contact-card ${contacto.favorito ? 'is-favorite' : ''}`;
            card.dataset.id = contacto.id;

            const categoriaClase = contacto.categoria ? contacto.categoria.toLowerCase() : 'general';

            card.innerHTML = `
                <div class="card-header">
                    <div class="contact-name-group">
                        <h3 class="contact-name">${escaparHtml(contacto.nombre)} ${escaparHtml(contacto.apellido)}</h3>
                        <span class="category-tag ${categoriaClase}">${escaparHtml(contacto.categoria || 'General')}</span>
                    </div>
                    <button type="button" class="btn-star ${contacto.favorito ? 'active' : ''}" 
                            data-action="toggle-fav" data-id="${contacto.id}" 
                            title="${contacto.favorito ? 'Quitar de favoritos' : 'Marcar como favorito'}">
                        ★
                    </button>
                </div>
                <div class="card-body">
                    <div class="contact-info-row">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span>${escaparHtml(contacto.telefono)}</span>
                    </div>
                    <div class="contact-info-row">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <span>${escaparHtml(contacto.email)}</span>
                    </div>
                    ${contacto.direccion ? `
                    <div class="contact-info-row">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>${escaparHtml(contacto.direccion)}</span>
                    </div>` : ''}
                </div>
                <div class="card-actions">
                    <button type="button" class="btn btn-secondary btn-sm" data-action="edit" data-id="${contacto.id}">
                        Editar
                    </button>
                    <button type="button" class="btn btn-danger btn-sm" data-action="delete" data-id="${contacto.id}">
                        Eliminar
                    </button>
                </div>
            `;

            fragment.appendChild(card);
        });

        this.elementos.listaContactos.appendChild(fragment);
    },

    actualizarEstadisticas(contactos) {
        if (!contactos) return;
        const total = contactos.length;
        const favoritos = contactos.filter(c => c.favorito).length;
        const trabajo = contactos.filter(c => c.categoria && c.categoria.toLowerCase() === 'trabajo').length;
        const familia = contactos.filter(c => c.categoria && c.categoria.toLowerCase() === 'familia').length;
        const amigos = contactos.filter(c => c.categoria && c.categoria.toLowerCase() === 'amigos').length;

        if (this.elementos.statTotal) this.elementos.statTotal.textContent = total;
        if (this.elementos.statFavoritos) this.elementos.statFavoritos.textContent = favoritos;
        if (this.elementos.statTrabajo) this.elementos.statTrabajo.textContent = trabajo;
        if (this.elementos.statFamilia) this.elementos.statFamilia.textContent = familia;
        if (this.elementos.statAmigos) this.elementos.statAmigos.textContent = amigos;
    },

    abrirModal(modo = 'crear', datos = null) {
        this.limpiarErrores();
        this.elementos.formContacto.reset();

        if (modo === 'editar' && datos) {
            this.elementos.modalTitulo.textContent = 'Editar Contacto';
            this.elementos.contactoId.value = datos.id;
            this.elementos.inputNombre.value = datos.nombre;
            this.elementos.inputApellido.value = datos.apellido;
            this.elementos.inputTelefono.value = datos.telefono;
            this.elementos.inputEmail.value = datos.email;
            this.elementos.inputDireccion.value = datos.direccion || '';
            this.elementos.selectCategoria.value = datos.categoria || 'General';
            this.elementos.checkFavorito.checked = Boolean(datos.favorito);
        } else {
            this.elementos.modalTitulo.textContent = 'Nuevo Contacto';
            this.elementos.contactoId.value = '';
            this.elementos.selectCategoria.value = 'General';
            this.elementos.checkFavorito.checked = false;
        }

        this.elementos.modalContacto.classList.remove('hidden');
        this.elementos.inputNombre.focus();
    },

    cerrarModal() {
        this.elementos.modalContacto.classList.add('hidden');
        this.elementos.formContacto.reset();
        this.limpiarErrores();
    },

    abrirModalConfirmar(nombreContacto) {
        this.elementos.confirmarMensaje.textContent = `¿Estás seguro de que deseas eliminar el contacto "${nombreContacto}"? Esta acción no se puede deshacer.`;
        this.elementos.modalConfirmar.classList.remove('hidden');
    },

    cerrarModalConfirmar() {
        this.elementos.modalConfirmar.classList.add('hidden');
    },

    obtenerDatosFormulario() {
        return {
            id: this.elementos.contactoId.value ? parseInt(this.elementos.contactoId.value, 10) : null,
            nombre: this.elementos.inputNombre.value.trim(),
            apellido: this.elementos.inputApellido.value.trim(),
            telefono: this.elementos.inputTelefono.value.trim(),
            email: this.elementos.inputEmail.value.trim(),
            direccion: this.elementos.inputDireccion.value.trim(),
            categoria: this.elementos.selectCategoria.value,
            favorito: this.elementos.checkFavorito.checked
        };
    },

    validarFormulario(datos) {
        this.limpiarErrores();
        let esValido = true;

        if (!datos.nombre || datos.nombre.length < 2) {
            this.mostrarErrorCampo('errorNombre', 'El nombre debe tener al menos 2 caracteres.');
            this.elementos.inputNombre.classList.add('invalid');
            esValido = false;
        }

        if (!datos.apellido || datos.apellido.length < 2) {
            this.mostrarErrorCampo('errorApellido', 'El apellido debe tener al menos 2 caracteres.');
            this.elementos.inputApellido.classList.add('invalid');
            esValido = false;
        }

        const regexTelefono = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
        if (!datos.telefono || !regexTelefono.test(datos.telefono)) {
            this.mostrarErrorCampo('errorTelefono', 'Ingrese un formato de teléfono válido.');
            this.elementos.inputTelefono.classList.add('invalid');
            esValido = false;
        }

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!datos.email || !regexEmail.test(datos.email)) {
            this.mostrarErrorCampo('errorEmail', 'Ingrese un correo electrónico válido.');
            this.elementos.inputEmail.classList.add('invalid');
            esValido = false;
        }

        return esValido;
    },

    mostrarErrorCampo(idElemento, mensaje) {
        const elemento = document.getElementById(idElemento);
        if (elemento) {
            elemento.textContent = mensaje;
        }
    },

    limpiarErrores() {
        ['errorNombre', 'errorApellido', 'errorTelefono', 'errorEmail', 'errorDireccion'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '';
        });

        [
            this.elementos.inputNombre,
            this.elementos.inputApellido,
            this.elementos.inputTelefono,
            this.elementos.inputEmail,
            this.elementos.inputDireccion
        ].forEach(input => {
            if (input) input.classList.remove('invalid');
        });
    },

    mostrarToast(mensaje, tipo = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${tipo}`;
        toast.textContent = mensaje;

        this.elementos.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'opacity 0.2s, transform 0.2s';
            setTimeout(() => toast.remove(), 200);
        }, 3200);
    }
};
