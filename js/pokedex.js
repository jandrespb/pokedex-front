import { MAX_PAGE } from './config.js';
import { obtenerDetallePokemon, obtenerPokemonesPorPagina } from './api.js';

export function initPokedex({ detallePokemon, estadoDetalle }) {
    let encendida = false;
    let paginaActual = 0;
    let indiceSeleccionado = 0;
    let pokemonesActuales = [];

    function obtenerLista() {
        return document.querySelector('.pantalla-pokedex ul');
    }

    function obtenerLuz() {
        return document.querySelector('.luz-pokedex');
    }

    function bloquearSeleccion(bloquear) {
        obtenerLista()?.classList.toggle('bloqueada', bloquear);
        document.querySelector('.centro')?.classList.toggle('bloqueada', bloquear);
    }

    async function seleccionarPokemon(id) {
        if (estadoDetalle.estaCargando()) return;

        estadoDetalle.iniciarCarga();
        bloquearSeleccion(true);
        detallePokemon.mostrarCarga();

        try {
            const detalle = await obtenerDetallePokemon(id);
            detallePokemon.renderizar(detalle);
        } catch (error) {
            console.error('No se pudo cargar el detalle del Pokémon:', error);
            detallePokemon.mostrarError();
        } finally {
            estadoDetalle.finalizarCarga();
            bloquearSeleccion(false);
        }
    }

    function mostrarBienvenida() {
        const lista = obtenerLista();
        if (!lista) return;

        lista.innerHTML = '<li class="mensaje-bienvenida">Bienvenid@, enciende la pokedex!</li>';
    }

    function resaltarSeleccion() {
        const lista = obtenerLista();
        if (!lista) return;

        const items = Array.from(lista.querySelectorAll('li:not(.mensaje-bienvenida)'));

        items.forEach((item, indice) => {
            item.classList.toggle('activo', indice === indiceSeleccionado);
        });

        const itemActivo = items[indiceSeleccionado];
        if (itemActivo) {
            itemActivo.scrollIntoView({ block: 'nearest' });
        }
    }

    function renderizarPokemones(pokemones) {
        const lista = obtenerLista();
        if (!lista) return;

        if (!pokemones.length) {
            lista.innerHTML = '<li class="mensaje-bienvenida">No hay pokemones para mostrar</li>';
            return;
        }

        lista.innerHTML = pokemones
            .map(({ id, nombre }) => `<li><span>${String(id).padStart(2, '0')}</span> ${nombre.toLowerCase()}</li>`)
            .join('');

        indiceSeleccionado = 0;
        resaltarSeleccion();
    }

    async function cargarPokemones() {
        if (!encendida) {
            mostrarBienvenida();
            return;
        }

        const lista = obtenerLista();
        if (!lista) return;

        try {
            pokemonesActuales = await obtenerPokemonesPorPagina(paginaActual);
            renderizarPokemones(pokemonesActuales);
        } catch (error) {
            console.error('No se pudo cargar la lista de Pokémon:', error);
            lista.innerHTML = '<li class="mensaje-bienvenida">No se pudo cargar la pokedex</li>';
        }
    }

    function moverSeleccion(direccion) {
        if (!encendida || !pokemonesActuales.length) return;

        if (direccion === 'up') {
            indiceSeleccionado = Math.max(0, indiceSeleccionado - 1);
        }

        if (direccion === 'down') {
            indiceSeleccionado = Math.min(pokemonesActuales.length - 1, indiceSeleccionado + 1);
        }

        resaltarSeleccion();
    }

    function cambiarPagina(direccion) {
        if (!encendida) return;

        if (direccion === 'left') {
            paginaActual = Math.max(0, paginaActual - 1);
        }

        if (direccion === 'right') {
            paginaActual = Math.min(MAX_PAGE, paginaActual + 1);
        }

        cargarPokemones();
    }

    function encenderPokedex() {
        encendida = true;
        obtenerLuz()?.classList.add('encendida');
        cargarPokemones();
    }

    function apagarPokedex() {
        encendida = false;
        pokemonesActuales = [];
        indiceSeleccionado = 0;
        obtenerLuz()?.classList.remove('encendida');
        mostrarBienvenida();
        detallePokemon.mostrarPlaceholder();
    }

    function registrarEventos() {
        document.querySelectorAll('[data-action]').forEach((elemento) => {
            elemento.addEventListener('click', () => {
                const accion = elemento.dataset.action;

                if (accion === 'on') {
                    encenderPokedex();
                    return;
                }

                if (accion === 'off') {
                    apagarPokedex();
                    return;
                }

                if (accion === 'up' || accion === 'down') {
                    moverSeleccion(accion);
                    return;
                }

                if (accion === 'left' || accion === 'right') {
                    cambiarPagina(accion);
                    return;
                }

                if (accion === 'select') {
                    if (!encendida || estadoDetalle.estaCargando() || !pokemonesActuales.length) return;

                    const pokemon = pokemonesActuales[indiceSeleccionado];
                    if (pokemon) seleccionarPokemon(pokemon.id);
                }
            });
        });

        document.querySelector('.pantalla-pokedex')?.addEventListener('click', (evento) => {
            if (!encendida || estadoDetalle.estaCargando()) return;

            const item = evento.target.closest('li:not(.mensaje-bienvenida)');
            if (!item) return;

            const lista = obtenerLista();
            if (!lista) return;

            const items = Array.from(lista.querySelectorAll('li:not(.mensaje-bienvenida)'));
            const indice = items.indexOf(item);
            if (indice === -1) return;

            indiceSeleccionado = indice;
            resaltarSeleccion();
            seleccionarPokemon(pokemonesActuales[indice].id);
        });
    }

    function iniciar() {
        mostrarBienvenida();
        detallePokemon.mostrarPlaceholder();
        registrarEventos();
    }

    iniciar();
}
