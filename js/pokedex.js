const API_BASE_URL = 'http://localhost:8080/pokemon';
const MAX_PAGE = 10;

let encendida = false;
let paginaActual = 0;
let indiceSeleccionado = 0;
let pokemonesActuales = [];
let cargandoDetalle = false;

function obtenerLista() {
    return document.querySelector('.pantalla-pokedex ul');
}

function obtenerLuz() {
    return document.querySelector('.luz-pokedex');
}

function obtenerElementosDetalle() {
    return {
        imagen: document.querySelector('.imagen-pokemon'),
        nombre: document.querySelector('.nombre-pokemon'),
        id: document.querySelector('.dato-id'),
        familia: document.querySelector('.dato-familia'),
        evolucion: document.querySelector('.dato-evolucion'),
        altura: document.querySelector('.dato-altura'),
        peso: document.querySelector('.dato-peso'),
        poderes: document.querySelector('.dato-poderes'),
        debilidad: document.querySelector('.dato-debilidad'),
        juegosCabecera: document.querySelector('.fila-juegos-cabecera'),
        juegosFila: document.querySelector('.fila-juegos-marca'),
    };
}

function mostrarPlaceholderDetalle() {
    const el = obtenerElementosDetalle();
    if (!el.nombre) return;

    el.imagen.src = '';
    el.imagen.alt = '';
    el.nombre.textContent = '???';
    el.id.textContent = '---';
    el.familia.textContent = '-';
    el.evolucion.textContent = '-';
    el.altura.textContent = '-';
    el.peso.textContent = '-';
    el.poderes.textContent = '-';
    el.debilidad.textContent = '-';
    el.juegosCabecera.innerHTML = '<th>Juegos</th>';
    el.juegosFila.innerHTML = '<th>Selecciona un pokémon</th>';
}

function mostrarCargandoDetalle() {
    const el = obtenerElementosDetalle();
    if (!el.nombre) return;

    el.nombre.textContent = 'cargando...';
    el.juegosFila.innerHTML = '<th>Cargando información...</th>';
}

function mostrarErrorDetalle() {
    const el = obtenerElementosDetalle();
    if (!el.nombre) return;

    el.nombre.textContent = 'error';
    el.juegosFila.innerHTML = '<th>No se pudo cargar el detalle</th>';
}

function renderizarDetallePokemon(pokemon) {
    const el = obtenerElementosDetalle();
    if (!el.nombre) return;

    el.imagen.src = pokemon.imagenUrl || '';
    el.imagen.alt = pokemon.nombre || '';
    el.nombre.textContent = (pokemon.nombre || '').toLowerCase();
    el.id.textContent = String(pokemon.id).padStart(3, '0');
    el.familia.textContent = pokemon.familia || '-';
    el.evolucion.textContent = pokemon.evolucion || '-';
    el.altura.textContent = pokemon.altura != null ? `${pokemon.altura} m` : '-';
    el.peso.textContent = pokemon.peso != null ? `${pokemon.peso} kg` : '-';
    el.poderes.textContent = (pokemon.poderes || []).map((poder) => poder.nombre).join(', ') || '-';
    el.debilidad.textContent = (pokemon.debilidades || []).map((debilidad) => debilidad.nombre).join(', ') || '-';

    const juegos = pokemon.juegos || [];
    if (juegos.length) {
        el.juegosCabecera.innerHTML = juegos.map((juego) => `<th>${juego.nombre}</th>`).join('');
        el.juegosFila.innerHTML = juegos.map(() => '<th>X</th>').join('');
    } else {
        el.juegosCabecera.innerHTML = '<th>Juegos</th>';
        el.juegosFila.innerHTML = '<th>Sin juegos registrados</th>';
    }
}

function bloquearSeleccion(bloquear) {
    obtenerLista()?.classList.toggle('bloqueada', bloquear);
    document.querySelector('.centro')?.classList.toggle('bloqueada', bloquear);
}

async function seleccionarPokemon(id) {
    if (cargandoDetalle) return;

    cargandoDetalle = true;
    bloquearSeleccion(true);
    mostrarCargandoDetalle();

    try {
        const respuesta = await fetch(`${API_BASE_URL}/${id}`);
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

        const detalle = await respuesta.json();
        renderizarDetallePokemon(detalle);
    } catch (error) {
        console.error('No se pudo cargar el detalle del Pokémon:', error);
        mostrarErrorDetalle();
    } finally {
        cargandoDetalle = false;
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
    obtenerLuz()?.classList.add('encendida');
    cargarPokemones();
}

function apagarPokedex() {
    encendida = false;
    pokemonesActuales = [];
    indiceSeleccionado = 0;
    obtenerLuz()?.classList.remove('encendida');
    mostrarBienvenida();
    mostrarPlaceholderDetalle();
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarBienvenida();
    mostrarPlaceholderDetalle();

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
                if (!encendida || cargandoDetalle || !pokemonesActuales.length) return;

                const pokemon = pokemonesActuales[indiceSeleccionado];
                if (pokemon) seleccionarPokemon(pokemon.id);
            }
        });
    });

    document.querySelector('.pantalla-pokedex')?.addEventListener('click', (evento) => {
        if (!encendida || cargandoDetalle) return;

        const item = evento.target.closest('li:not(.mensaje-bienvenida)');
        if (!item) return;

        const lista = obtenerLista();
        const items = Array.from(lista.querySelectorAll('li:not(.mensaje-bienvenida)'));
        const indice = items.indexOf(item);
        if (indice === -1) return;

        indiceSeleccionado = indice;
        resaltarSeleccion();
        seleccionarPokemon(pokemonesActuales[indice].id);
    });
});
