const API_BASE_URL = 'http://localhost:8080/pokemon';
const MAX_PAGE = 10;

let encendida = false;
let paginaActual = 0;
let indiceSeleccionado = 0;
let pokemonesActuales = [];

function obtenerLista() {
    return document.querySelector('.pantalla-pokedex ul');
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
        const respuesta = await fetch(`${API_BASE_URL}?page=${paginaActual}`);
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

        pokemonesActuales = await respuesta.json();
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
    cargarPokemones();
}

function apagarPokedex() {
    encendida = false;
    pokemonesActuales = [];
    indiceSeleccionado = 0;
    mostrarBienvenida();
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarBienvenida();

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
            }
        });
    });
});
