export function crearEstadoDetalle() {
    let cargando = false;

    return {
        estaCargando() {
            return cargando;
        },
        iniciarCarga() {
            if (cargando) return false;
            cargando = true;
            return true;
        },
        finalizarCarga() {
            cargando = false;
        },
    };
}

export function crearVistaDetallePokemon() {
    const elementos = {
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

    const hayDetalle = Boolean(elementos.nombre);

    function mostrarPlaceholder() {
        if (!hayDetalle) return;

        elementos.imagen.src = '';
        elementos.imagen.alt = '';
        elementos.nombre.textContent = '???';
        elementos.id.textContent = '---';
        elementos.familia.textContent = '-';
        elementos.evolucion.textContent = '-';
        elementos.altura.textContent = '-';
        elementos.peso.textContent = '-';
        elementos.poderes.textContent = '-';
        elementos.debilidad.textContent = '-';
        elementos.juegosCabecera.innerHTML = '<th>Juegos</th>';
        elementos.juegosFila.innerHTML = '<th>Selecciona un pokémon</th>';
    }

    function mostrarCarga() {
        if (!hayDetalle) return;

        elementos.nombre.textContent = 'cargando...';
        elementos.juegosFila.innerHTML = '<th>Cargando información...</th>';
    }

    function mostrarError() {
        if (!hayDetalle) return;

        elementos.nombre.textContent = 'error';
        elementos.juegosFila.innerHTML = '<th>No se pudo cargar el detalle</th>';
    }

    function renderizar(pokemon) {
        if (!hayDetalle) return;

        elementos.imagen.src = pokemon.imagenUrl || '';
        elementos.imagen.alt = pokemon.nombre || '';
        elementos.nombre.textContent = (pokemon.nombre || '').toLowerCase();
        elementos.id.textContent = String(pokemon.id).padStart(3, '0');
        elementos.familia.textContent = pokemon.familia || '-';
        elementos.evolucion.textContent = pokemon.evolucion || '-';
        elementos.altura.textContent = pokemon.altura != null ? `${pokemon.altura} m` : '-';
        elementos.peso.textContent = pokemon.peso != null ? `${pokemon.peso} kg` : '-';
        elementos.poderes.textContent = (pokemon.poderes || []).map((poder) => poder.nombre).join(', ') || '-';
        elementos.debilidad.textContent = (pokemon.debilidades || []).map((debilidad) => debilidad.nombre).join(', ') || '-';

        const juegos = pokemon.juegos || [];
        if (juegos.length) {
            elementos.juegosCabecera.innerHTML = juegos.map((juego) => `<th>${juego.nombre}</th>`).join('');
            elementos.juegosFila.innerHTML = juegos.map(() => '<th>X</th>').join('');
            return;
        }

        elementos.juegosCabecera.innerHTML = '<th>Juegos</th>';
        elementos.juegosFila.innerHTML = '<th>Sin juegos registrados</th>';
    }

    return {
        mostrarPlaceholder,
        mostrarCarga,
        mostrarError,
        renderizar,
    };
}