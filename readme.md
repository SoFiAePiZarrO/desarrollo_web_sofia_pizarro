# Tarea 3 - Desarrollo de Aplicaciones Web

## Descripción

Este proyecto corresponde a la continuación de la Tarea 2, en la que se desarrolló una aplicación para el registro de avistamientos de aves. En esta etapa se agregaron nuevas funcionalidades, principalmente la visualización de estadísticas mediante gráficos y la posibilidad de agregar comentarios a los avistamientos registrados.

## Nuevas funcionalidades

Se incorporó una página de métricas e indicadores que permite visualizar información de los avistamientos y voluntarios mediante tres gráficos: cantidad de avistamientos por día, cantidad de avistamientos por especie de ave y cantidad de voluntarios por comuna. Para esto se utilizó la biblioteca Flot, obteniendo los datos directamente desde la base de datos a través de rutas implementadas en Flask.

También se agregó una sección de comentarios en la página de detalle de cada avistamiento. Esta permite ingresar un nombre y un comentario, que queda asociado al avistamiento correspondiente. Los comentarios registrados se muestran junto con la fecha, el nombre de quien comenta y el texto ingresado. Para implementar esta funcionalidad se agregó la tabla `comentario` a la base de datos.

Para actualizar la información sin tener que recargar la página se utilizó `fetch()` en JavaScript. Esta función permite realizar solicitudes a Flask y recibir respuestas en formato JSON. En este caso, se utiliza para obtener los comentarios de un avistamiento y para enviar nuevos comentarios al servidor, actualizando posteriormente su contenido en la página.

Además, se incorporaron validaciones tanto en JavaScript como en el servidor. En JavaScript se revisan los datos ingresados antes de enviarlos, mostrando los errores correspondientes en el formulario. Por otro lado, en el servidor se vuelven a validar mediante las funciones implementadas en `utils/validaciones.py`, que son utilizadas desde `app.py`. Para los comentarios, se comprueba que el nombre tenga entre 3 y 50 caracteres y que el texto tenga al menos 5 caracteres.

## Instalación y ejecución

Para ejecutar el proyecto se necesita tener instalado Python y MySQL Server. Primero se debe crear la base de datos `tarea2` en MySQL e importar los archivos SQL disponibles en la carpeta `database`, que contienen las instrucciones para crear las tablas y cargar los datos correspondientes.

Desde la carpeta `Tarea 1`, se debe crear un entorno virtual e instalar las dependencias del proyecto:

```bash
python -m venv venv
```

En Windows, si se utiliza PowerShell, puede ser necesario permitir la ejecución de scripts durante la sesión actual y luego activar el entorno virtual:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate.ps1
```

Una vez activado, instalar las dependencias con:

```bash
pip install -r requirements.txt
```

Finalmente, desde la misma carpeta se ejecuta la aplicación:

```bash
python app.py
```

La aplicación estará disponible en:

    http://127.0.0.1:5000/
    
## Consideraciones

La base de datos no se encuentra incluida directamente en el repositorio, por lo que es necesario crearla e importar los archivos SQL antes de ejecutar la aplicación. Los registros de avistamientos, voluntarios y comentarios deben ingresarse para probar las distintas funcionalidades. Los archivos multimedia que se adjuntan a los avistamientos se almacenan en `static/uploads/`.