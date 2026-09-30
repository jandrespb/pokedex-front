# Pokédex Frontend

Frontend web de una Pokédex desarrollado con **HTML, CSS y Vanilla JavaScript**.
El proyecto esta pensado para practicar **QA y automatizacion de pruebas** sobre
una aplicacion web que consume una API REST.

Repositorio: [github.com/jandrespb/pokedex-front](https://github.com/jandrespb/pokedex-front)

> Importante: este frontend necesita el backend de la Pokédex para funcionar.
> Debes descargarlo, configurarlo y ejecutarlo antes de abrir la aplicacion.

## Repositorios

- Frontend: [pokedex-front](https://github.com/jandrespb/pokedex-front).
- Backend: [pokedex-back](https://github.com/jandrespb/pokedex-back)

El backend expone los datos de Pokemon, tipos, poderes, debilidades y juegos.
El frontend consume sus endpoints mediante solicitudes `fetch`.

## Tecnologias

- HTML5
- CSS3
- Vanilla JavaScript, sin frameworks ni librerias externas
- Modulos ES nativos (`type="module"`)
- API REST desarrollada con Spring Boot en el backend

## Requisitos previos

Para el frontend no necesitas instalar Node.js, npm, dependencias ni ejecutar
un proceso de compilacion. El proyecto funciona como una aplicacion web
estatica.

Sin embargo, para que la Pokédex cargue informacion necesitas tener preparado
el backend. Consulta su [README](https://github.com/jandrespb/pokedex-back#readme)
para conocer los requisitos de Java, Maven y MySQL.

## Descargar el proyecto

Clona el frontend y el backend:

```bash
git clone https://github.com/jandrespb/pokedex-front.git
git clone https://github.com/jandrespb/pokedex-back.git
```

Tambien puedes descargar ambos proyectos desde GitHub usando **Code > Download ZIP**.

## Configurar y ejecutar el backend

El backend debe ejecutarse en `http://localhost:8080`, que es la direccion que
utiliza este frontend por defecto.

1. Configura MySQL y crea la base de datos `pokedex-db` siguiendo las
	 instrucciones del README del backend.
2. Ejecuta los scripts SQL de creacion y poblacion.
3. Configura las credenciales de MySQL en `application.properties`.
4. Inicia la API desde la carpeta del backend:

```bash
./mvnw spring-boot:run
```

En Windows:

```bash
mvnw.cmd spring-boot:run
```

Comprueba que el backend responde antes de continuar:

```bash
curl "http://localhost:8080/pokemon?page=0"
```

La API debe devolver una lista de Pokemon.

## Ejecutar el frontend

No hay pasos de instalacion ni comandos de npm. Una vez iniciado el backend,
abre el archivo `index.html` desde un servidor local de archivos estaticos.

Puedes usar cualquiera de estas opciones:

- Abrir el proyecto con VS Code y ejecutar `index.html` con la extension Live
	Server.
- Servir la carpeta con cualquier servidor estatico disponible en tu entorno.

El frontend esta configurado para consumir:

```text
http://localhost:8080/pokemon
```

Si el backend utiliza otra direccion o puerto, actualiza la constante
`API_BASE_URL` en `js/config.js`.

## Funcionalidades

- Encender y apagar la Pokédex.
- Navegar por la lista de Pokemon mediante el panel de control.
- Consultar el detalle de un Pokemon.
- Buscar Pokemon por nombre o identificador.
- Mostrar familia, evolucion, altura, peso, poderes, debilidades y juegos.
- Limpiar el campo de busqueda y volver al estado inicial.

## Endpoints consumidos

El frontend utiliza los siguientes endpoints del backend:

| Funcion | Metodo | Endpoint |
| --- | --- | --- |
| Listar Pokemon | `GET` | `/pokemon?page=0` |
| Consultar detalle | `GET` | `/pokemon/{id}` |
| Buscar por nombre o ID | `GET` | `/pokemon/buscar?query={valor}` |

La paginacion empieza en `0` y el frontend contempla hasta la pagina `37`, de
acuerdo con la configuracion actual de `js/config.js`.

## Estructura principal

```text
├── index.html              Pagina principal
├── img/                    Imagenes de la interfaz y Pokemon
├── fonts/                  Fuentes del proyecto
├── js/
│   ├── api.js              Solicitudes a la API
│   ├── buscador-pokemon.js Logica de busqueda
│   ├── config.js           URL base de la API y paginacion
│   ├── index.js            Punto de entrada de la aplicacion
│   ├── pokedex.js          Logica de la Pokédex
│   └── utils.js            Funciones auxiliares
└── styles/                 Hojas de estilo
```

## Solucion de problemas

### No aparecen Pokemon

Confirma que el backend este iniciado y que esta URL responda:

```text
http://localhost:8080/pokemon?page=0
```

### Error de conexion o CORS

Revisa que la API este ejecutandose en el puerto `8080` y que el frontend se
este abriendo desde un servidor local. Si cambiaste el puerto del backend,
actualiza `js/config.js` y la configuracion CORS del backend.

### La pagina se abre, pero los modulos no cargan

No abras el archivo directamente con `file://`. Usa Live Server o un servidor
local de archivos estaticos para que el navegador pueda cargar los modulos
JavaScript correctamente.

