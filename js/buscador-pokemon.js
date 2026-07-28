function obtenerElementosBuscador() {
    return {
        input: document.querySelector('.input-buscador'),
        botonBuscar: document.querySelector('.boton-buscador'),
        botonLimpiar: document.querySelector('.boton-limpiar'),
    };
}

async function buscarPokemon() {
    if (cargandoDetalle) return;

    const { input } = obtenerElementosBuscador();
    if (!input) return;

    const query = input.value.trim();

    cargandoDetalle = true;
    mostrarCargandoDetalle();

    try {
        const respuesta = await fetch(`${API_BASE_URL}/buscar?query=${encodeURIComponent(query)}`);
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarPlaceholderDetalle();
            alert(datos.mensaje);
            return;
        }

        renderizarDetallePokemon(datos);
    } catch (error) {
        console.error('No se pudo realizar la búsqueda:', error);
        mostrarPlaceholderDetalle();
        alert('No se pudo conectar con el servidor');
    } finally {
        cargandoDetalle = false;
    }
}

function limpiarBusqueda() {
    const { input } = obtenerElementosBuscador();
    if (input) input.value = '';
    mostrarPlaceholderDetalle();
}

document.addEventListener('DOMContentLoaded', () => {
    const { botonBuscar, botonLimpiar } = obtenerElementosBuscador();

    botonBuscar?.addEventListener('click', buscarPokemon);
    botonLimpiar?.addEventListener('click', limpiarBusqueda);
});
