# Tarea 2 - Desarrollo de Aplicaciones Web

## Instalación y ejecución

Para ejecutar el proyecto se necesita Python 3 y MySQL Server.

Primero se debe crear y activar un entorno virtual:

    python -m venv venv
    venv\Scripts\activate

Luego se deben instalar las dependencias:

    pip install -r requirements.txt

La aplicación utiliza una base de datos MySQL llamada `tarea2`. Antes de ejecutar la aplicación es necesario crear la base de datos e importar los archivos `.sql` correspondientes.

Finalmente, desde la carpeta principal del proyecto se puede ejecutar:

    python app.py

La aplicación estará disponible en:

    http://127.0.0.1:5000/


## Consideraciones sobre la base de datos

Una de las principales dificultades que tuve durante el desarrollo fue la inicialización de la base de datos. En un principio había creado la base de datos `tarea2`, pero las tablas y sus datos no se encontraban cargados.

Para solucionarlo tuve que importar los archivos `.sql` desde CMD antes de ejecutar la aplicación. Esto fue especialmente importante para las regiones, comunas y aves, ya que los formularios dependen de estos datos.

También tuve problemas con la codificación de algunos caracteres al importar las regiones y comunas, principalmente con tildes y la letra ñ. Para evitar este problema fue necesario realizar la importación utilizando la codificación correspondiente.


## Identificación del voluntario en un avistamiento

Una decisión que tuve que tomar fue cómo identificar al voluntario que registra un avistamiento.

Como la aplicación todavía no cuenta con un sistema de inicio de sesión, no es posible conocer automáticamente qué voluntario está utilizando la aplicación. En un principio utilicé un selector que mostraba todos los voluntarios registrados, pero decidí cambiar este funcionamiento.

Actualmente, el formulario solicita el nombre y correo electrónico de la persona. Con estos dos datos se realiza una consulta a la base de datos para comprobar que el voluntario se encuentre registrado.

Si existe un voluntario que coincide con ambos datos, se obtiene su `id` y se utiliza para asociarlo al nuevo avistamiento. Si no existe, el avistamiento no es registrado y se informa el error al usuario.

De esta manera, el formulario no necesita mostrar la lista completa de voluntarios registrados y la relación con el avistamiento continúa realizándose mediante el `voluntario_id` almacenado en la base de datos.


## Dificultades durante el desarrollo

Además de la inicialización de la base de datos, tuve algunas dificultades al trabajar con las relaciones de SQLAlchemy.

En particular, al mostrar los avistamientos en la página principal apareció un error `DetachedInstanceError`, debido a que se intentaba acceder a información relacionada con el avistamiento después de que la sesión de SQLAlchemy ya se había cerrado.

Esto se solucionó modificando la forma en que se obtenían los avistamientos, de manera que la información relacionada necesaria estuviera cargada antes de cerrar la sesión.
