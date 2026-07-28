import { API_BASE_URL } from './config.js';

async function solicitarJson(ruta) {
    const respuesta = await fetch(`${API_BASE_URL}${ruta}`);

    let datos = null;
    try {
        datos = await respuesta.json();
    } catch {
        datos = null;
    }

    if (!respuesta.ok) {
        const error = new Error(datos?.mensaje || `Error HTTP: ${respuesta.status}`);
        error.datos = datos;
        throw error;
    }

    return datos;
}

export function obtenerPokemonesPorPagina(pagina) {
    return solicitarJson(`?page=${pagina}`);
}

export function obtenerDetallePokemon(id) {
    return solicitarJson(`/${id}`);
}

export function buscarPokemon(query) {
    return solicitarJson(`/buscar?query=${encodeURIComponent(query)}`);
}