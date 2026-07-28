import { buscarPokemon, obtenerDetallePokemon } from './api.js';

function esNidoran(query) {
    return query.toLowerCase() === 'nidoran';
}

function seleccionarFormaNidoran() {
    const opcion = window.prompt('Nidoran tiene dos formas. Escribe 1 para macho o 2 para hembra:', '1');

    if (opcion === null) return null;

    if (opcion.trim() === '1') return 29;
    if (opcion.trim() === '2') return 32;

    return null;
}

export function initBuscador({ detallePokemon, estadoDetalle }) {
    function obtenerElementosBuscador() {
        return {
            input: document.querySelector('.input-buscador'),
            botonBuscar: document.querySelector('.boton-buscador'),
            botonLimpiar: document.querySelector('.boton-limpiar'),
        };
    }

    async function ejecutarBusqueda() {
        if (estadoDetalle.estaCargando()) return;

        const { input } = obtenerElementosBuscador();
        if (!input) return;

        const query = input.value.trim();

        if (!query) {
            detallePokemon.mostrarPlaceholder();
            return;
        }

        const requiereSeleccionNidoran = esNidoran(query);
        const idNidoran = requiereSeleccionNidoran ? seleccionarFormaNidoran() : null;

        if (requiereSeleccionNidoran && idNidoran === null) {
            return;
        }

        estadoDetalle.iniciarCarga();
        detallePokemon.mostrarCarga();

        try {
            const datos = requiereSeleccionNidoran
                ? await obtenerDetallePokemon(idNidoran)
                : await buscarPokemon(query);
            detallePokemon.renderizar(datos);
        } catch (error) {
            console.error('No se pudo realizar la búsqueda:', error);
            detallePokemon.mostrarPlaceholder();

            if (error.datos?.mensaje) {
                alert(error.datos.mensaje);
                return;
            }

            alert('No se pudo conectar con el servidor');
        } finally {
            estadoDetalle.finalizarCarga();
        }
    }

    function limpiarBusqueda() {
        const { input } = obtenerElementosBuscador();
        if (input) input.value = '';
        detallePokemon.mostrarPlaceholder();
    }

    const { botonBuscar, botonLimpiar } = obtenerElementosBuscador();
    botonBuscar?.addEventListener('click', ejecutarBusqueda);
    botonLimpiar?.addEventListener('click', limpiarBusqueda);
}
