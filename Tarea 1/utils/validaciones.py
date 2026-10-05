import re
from datetime import datetime
from dateutil.relativedelta import relativedelta

# valida los datos recibidos del formulario de registro de voluntario 
# y retorna una lista de cadenas con los errores encontrados.
def validar_voluntario(form_data):

    errores = []

    nombre = form_data.get("nombre", "").strip()
    email = form_data.get("email", "").strip()
    telefono = form_data.get("telefono", "").strip()
    comuna_id = form_data.get("comuna_id", "").strip()

    # validacion nombre
    if not nombre:
        errores.append("El nombre completo es obligatorio.")
    elif len(nombre) < 3:
        errores.append("El nombre debe tener al menos 3 caracteres.")

    # validacion email
    patron_email = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not email:
        errores.append("El correo electrónico es obligatorio.")
    elif not re.match(patron_email, email):
        errores.append("Debe ingresar un formato de correo electrónico válido.")

    # validacion comuna
    if not comuna_id:
        errores.append("Debe seleccionar una región y comuna de residencia.")
    elif not comuna_id.isdigit():
        errores.append("La comuna seleccionada no es válida.")

    # validacion de celular
    if telefono:
        # permite + al inicio seguido de dígitos (entre 8 y 15 dígitos)
        telefono_limpio = telefono.replace(" ", "").replace("-", "")
        if not re.match(r'^\+?[0-9]{8,15}$', telefono_limpio):
            errores.append("El número de teléfono debe tener un formato válido (Ej: +56912345678).")

    return errores


# valida los datos recibidos del formulario de registro de avistamiento
# y retorna una lista de cadenas con los errores encontrados.
def validar_avistamiento(form_data, file_data):

    errores = []

    nombre_voluntario = form_data.get("nombre_voluntario", "").strip()
    email_voluntario = form_data.get("email_voluntario", "").strip()
    ave_id = form_data.get("ave_id", "").strip()
    fecha_hora = form_data.get("fecha_hora", "").strip()
    lugar = form_data.get("lugar", "").strip()

    # validacion nombre voluntario
    if not nombre_voluntario:
        errores.append("Debe ingresar el nombre del voluntario.")
    elif len(nombre_voluntario) < 3:
        errores.append("El nombre debe tener al menos 3 caracteres.")

    # validacion email voluntario
    patron_email = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not email_voluntario:
        errores.append("Debe ingresar el correo electrónico del voluntario.")
    elif not re.match(patron_email, email_voluntario):
        errores.append("Debe ingresar un formato de correo electrónico válido.")

    # validacion ave
    if not ave_id or not ave_id.isdigit():
        errores.append("Debe seleccionar una especie de ave.")

    # validacion fecha y hora
    if not fecha_hora:
        errores.append("La fecha y hora del avistamiento son obligatorias.")
    else:
        try:
            fecha_seleccionada = datetime.strptime(
                fecha_hora,
                "%Y-%m-%dT%H:%M"
            )

            ahora = datetime.now()
            hace_un_mes = ahora - relativedelta(months=1)

            if fecha_seleccionada > ahora:
                errores.append(
                    "La fecha del avistamiento no puede ser futura."
                )

            elif fecha_seleccionada < hace_un_mes:
                errores.append(
                    "El avistamiento no puede tener más de un mes de antigüedad."
                )

        except ValueError:
            errores.append(
                "La fecha y hora ingresadas no tienen un formato válido."
            )

    # validacion lugar
    if not lugar:
        errores.append("El lugar del avistamiento es obligatorio.")

    # validar archivos adjuntos (fotografías o vídeos)
    if not file_data or all(file.filename == "" for file in file_data):
        errores.append("Debe adjuntar una fotografía o vídeo del avistamiento.")

    return errores