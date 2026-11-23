# Tarea 4

## Descripción

En esta tarea se incorporan nuevas funcionalidades al proyecto de avistamientos de aves desarrollado en las tareas anteriores. Para ello, se implementa un backend utilizando **Spring Boot**, que se integra con la aplicación existente desarrollada en Flask.

Las nuevas funcionalidades permiten buscar avistamientos de manera dinámica y evaluar los registros con notas.

## Funcionalidades implementadas

### 1. Búsqueda de avistamientos

Se incorpora un buscador que permite encontrar avistamientos a medida que el usuario escribe en el campo de búsqueda.

La búsqueda considera coincidencias en:
- Nombre del voluntario.
- Nombre del ave.
- Nombre de la comuna de registro del voluntario.

**Consideración sobre la comuna:** la búsqueda utiliza la comuna asociada al voluntario y no la comuna donde ocurrió el avistamiento. Esto se debe a la estructura actual de la base de datos, donde la tabla `avistamiento` no tiene una relación directa con la tabla `comuna`. La comuna se obtiene a través de la relación entre `avistamiento`, `voluntario` y `comuna`.

Los resultados muestran el nombre del voluntario, la fecha del avistamiento, el nombre del ave, la comuna y su evaluación promedio. Además, se destaca el texto que coincide con la búsqueda.

La búsqueda se realiza de manera asíncrona mediante JavaScript y `fetch`, sin necesidad de recargar la página.

### 2. Evaluación de avistamientos

Cada resultado de búsqueda permite ingresar una evaluación mediante una nota entera entre 1 y 7.

Las evaluaciones:
- Se almacenan en una nueva tabla llamada `nota`, asociada a cada avistamiento.
- Validan que la nota ingresada esté dentro del rango permitido.
- Permiten registrar múltiples evaluaciones para un mismo avistamiento.
- Calculan el promedio de las evaluaciones registradas.

Una vez guardada una evaluación, el promedio se actualiza directamente en la interfaz, sin recargar la página.

## Backend con Spring Boot

Se creó un nuevo proyecto backend utilizando **Java 17, Spring Boot, Spring Data JPA y MySQL**.

El backend se encarga de realizar las consultas de búsqueda, gestionar las evaluaciones y calcular los promedios.

Su estructura se organiza en los siguientes paquetes:

- `entity`: entidades que representan las tablas de la base de datos.
- `repository`: repositorios para acceder a los datos mediante Spring Data JPA.
- `service`: lógica de las funcionalidades implementadas.
- `controller`: endpoints que reciben las solicitudes HTTP.
- `dto`: objetos utilizados para entregar los resultados de búsqueda.

La comunicación entre la aplicación Flask y el backend Spring Boot se realiza mediante solicitudes HTTP asíncronas desde JavaScript.

## Endpoints del backend

El backend expone los siguientes endpoints para realizar las operaciones de búsqueda y evaluación:

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/avistamientos/buscar` | Busca avistamientos según el texto ingresado. |
| POST | `/api/notas` | Registra una evaluación y devuelve el promedio actualizado. |

### Búsqueda de avistamientos

**GET** `/api/avistamientos/buscar?texto={texto}`

Recibe el texto ingresado en el buscador y devuelve una lista de avistamientos que coinciden con el nombre del ave, el nombre del voluntario o la comuna de registro del voluntario.

### Registro de evaluaciones

**POST** `/api/notas?avistamientoId={id}&nota={nota}`

Recibe el identificador del avistamiento y la nota asignada (entero entre 1 y 7). Guarda la evaluación en la base de datos y devuelve el promedio actualizado del avistamiento.

Si la nota está fuera del rango permitido o el avistamiento no existe, devuelve un error HTTP 400.

## Consideraciones y mejoras futuras

Una mejora que sería interesante incorporar al sistema de evaluaciones es permitir que cada usuario pueda evaluar un avistamiento una sola vez y modificar su evaluación posteriormente. Esto permitiría evitar votos repetidos y contribuiría a que los promedios representen de mejor manera la opinión de distintos usuarios.

Sin embargo, esta funcionalidad no fue implementada debido a que el proyecto todavía no cuenta con un servicio de inicio de sesión. Sin un mecanismo para identificar a los usuarios, no es posible garantizar que cada persona pueda emitir una sola evaluación por avistamiento.

## Ejecución del proyecto

Para utilizar las nuevas funcionalidades es necesario ejecutar tanto la aplicación Flask como el backend Spring Boot.

### Requisitos

- Python y Flask.
- Java 17.
- MySQL.

### Base de datos

Se utiliza la base de datos `tarea2`, correspondiente al proyecto desarrollado anteriormente.

Para habilitar las evaluaciones, se debe ejecutar el script `Tarea 1/database/tabla-nota.sql` en MySQL. Este crea la tabla `nota`, que almacena las evaluaciones asociadas a los avistamientos.

También es necesario verificar la configuración de conexión a MySQL en `Tarea 4/backend/src/main/resources/application.properties`.

### Iniciar el backend Spring Boot

Desde una terminal, ubicarse en la carpeta `Tarea 4/backend` y ejecutar:

```powershell
.\mvnw.cmd spring-boot:run
```

El backend estará disponible en `http://localhost:8080`.

### Iniciar la aplicación Flask

Desde otra terminal, ubicarse en la carpeta `Tarea 1`, activar el entorno virtual e iniciar la aplicación:

```powershell
.\venv\Scripts\Activate.ps1
python app.py
```

La aplicación estará disponible en `http://localhost:5000`.

Una vez iniciados ambos servidores, se puede acceder al listado de avistamientos desde `http://localhost:5000/ver-avistamientos`.