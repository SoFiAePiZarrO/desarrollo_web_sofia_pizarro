import re

def validar_voluntario(form_data):
    """
    Valida los datos recibidos del formulario de registro de voluntario.
    Retorna una lista de cadenas con los errores encontrados.
    """
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


def validar_avistamiento(form_data, file_data):
    """
    Valida los datos recibidos del formulario de avistamiento.
    Retorna una lista de cadenas con los errores encontrados.
    """
    errores = []

    voluntario_id = form_data.get("voluntario_id", "").strip()
    ave_id = form_data.get("ave_id", "").strip()
    fecha_hora = form_data.get("fecha_hora", "").strip()
    lugar = form_data.get("lugar", "").strip()

    # validacion voluntario
    if not voluntario_id or not voluntario_id.isdigit():
        errores.append("Debe seleccionar un voluntario válido.")

    # validacion ave
    if not ave_id or not ave_id.isdigit():
        errores.append("Debe seleccionar una especie de ave.")

    # validacion fecha y hora
    if not fecha_hora:
        errores.append("La fecha y hora del avistamiento son obligatorias.")

    # validacion lugar
    if not lugar:
        errores.append("El lugar del avistamiento es obligatorio.")

    # validar archivo adjunto (fotografía o vídeo)
    if not file_data or file_data.filename == "":
        errores.append("Debe adjuntar una fotografía o vídeo del avistamiento.")

    return errores