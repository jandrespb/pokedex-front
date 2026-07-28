import { crearEstadoDetalle, crearVistaDetallePokemon } from './utils.js';
import { initPokedex } from './pokedex.js';
import { initBuscador } from './buscador-pokemon.js';

document.addEventListener('DOMContentLoaded', () => {
    const detallePokemon = crearVistaDetallePokemon();
    const estadoDetalle = crearEstadoDetalle();

    initPokedex({ detallePokemon, estadoDetalle });
    initBuscador({ detallePokemon, estadoDetalle });
});