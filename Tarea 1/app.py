from flask import Flask, request, render_template, redirect, url_for, flash
from database import db
from utils.validaciones import validar_voluntario, validar_avistamiento
from werkzeug.utils import secure_filename
import hashlib
import filetype
import os
from datetime import datetime

UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)
# secret key como en el auxiliar
app.secret_key = 'clave_secreta_ornitologos_chile'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# asegura que la carpeta de subidas exista localmente
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


# --- RUTAS DE LA APLICACIÓN ---

@app.route("/")
def index():
    ultimos_avistamientos = db.get_ultimos_avistamientos(limite=2)
    return render_template("index.html", avistamientos=ultimos_avistamientos)


@app.route("/registro-voluntario", methods=["GET", "POST"])
def registro_voluntario():
    if request.method == "POST":
        # validación en el lado del servidor (utils/validaciones.py)
        errores = validar_voluntario(request.form)

        # Si hay errores de validación, re-renderizar manteniendo el formulario visible y sus datos
        if errores:
            regiones = db.get_regiones()
            return render_template(
                "registro-voluntario.html",
                regiones=regiones,
                errores=errores,
                datos_previos=request.form
            )

        try:
            # insertar en tabla voluntario
            nuevo_voluntario = db.create_voluntario(
                nombre=request.form.get("nombre").strip(),
                email=request.form.get("email").strip(),
                telefono=request.form.get("telefono", "").strip(),
                fecha_registro=datetime.now(),
                comuna_id=int(request.form.get("comuna_id"))
            )

            # ofrecer agregar avistamiento o volver a inicio
            return render_template(
                "registro-exitoso.html",
                voluntario=nuevo_voluntario,
                mensaje=f"¡Voluntario(a) {nuevo_voluntario.nombre} registrado(a) con éxito!"
            )

        except Exception as e:
            regiones = db.get_regiones()
            return render_template(
                "registro-voluntario.html",
                regiones=regiones,
                errores=["Ocurrió un error al guardar en la base de datos."],
                datos_previos=request.form
            )

    elif request.method == "GET":
        regiones = db.get_regiones()
        return render_template("registro-voluntario.html", regiones=regiones)


@app.route("/registrar-avistamiento", methods=["GET", "POST"])
def registrar_avistamiento():
    if request.method == "POST":

        archivos = request.files.getlist("archivo-multimedia")

        # validacion datos del lado del servidor (utils/validaciones.py)
        errores = validar_avistamiento(request.form, archivos)

        # si existen errores de validación, re-renderizar manteniendo visible el formulario
        if errores:
            aves = db.get_aves()
            voluntarios = db.get_voluntarios()
            return render_template(
                "registrar-avistamiento.html",
                aves=aves,
                voluntarios=voluntarios,
                errores=errores,
                datos_previos=request.form
            )

        try:
            # procesar fecha y hora 'YYYY-MM-THH:MM'
            fecha_hora_str = request.form.get("fecha_hora")
            fecha_hora = datetime.strptime(fecha_hora_str, "%Y-%m-%dT%H:%M") if fecha_hora_str else datetime.now()

            # procesar y guardar cada archivo multimedia 
            archivos_procesados = []
            for file in archivos:
                if file and file.filename != "":
                    # Sanitizar y generar un hash SHA256 único
                    original_filename = secure_filename(file.filename)
                    _filename = hashlib.sha256(original_filename.encode("utf-8")).hexdigest()

                    # Detectar extensión real mediante magic bytes
                    kind = filetype.guess(file)
                    _extension = kind.extension if kind else original_filename.rsplit('.', 1)[-1]
                    img_filename = f"{_filename}.{_extension}"

                    # Guardar el archivo en static/uploads/
                    full_path = os.path.join(app.config["UPLOAD_FOLDER"], img_filename)
                    file.save(full_path)

                    # Guardar la ruta relativa que se registrará en MySQL
                    relative_path = f"uploads/{img_filename}"
                    archivos_procesados.append({
                        "ruta_archivo": relative_path,
                        "nombre_archivo": img_filename
                    })

            # insertar en las tablas 'avistamiento' y 'registro'
            db.create_avistamiento(
                voluntario_id=int(request.form.get("voluntario_id")),
                ave_id=int(request.form.get("ave_id")),
                fecha_hora=fecha_hora,
                lugar=request.form.get("lugar").strip(),
                descripcion=request.form.get("descripcion", "").strip(),
                archivos=archivos_procesados  # Lista de dicts para tabla 'registro'
            )

            # aviso de exito y redireccionamiento a la página de inicio
            flash("¡Avistamiento registrado exitosamente con sus archivos multimedia!", "success")
            return redirect(url_for("index"))

        except Exception as e:
            aves = db.get_aves()
            voluntarios = db.get_voluntarios()
            return render_template(
                "registrar-avistamiento.html",
                aves=aves,
                voluntarios=voluntarios,
                errores=["Ocurrió un error inesperado al procesar los archivos o la base de datos."],
                datos_previos=request.form
            )

    elif request.method == "GET":
        aves = db.get_aves()
        voluntarios = db.get_voluntarios()
        return render_template("registrar-avistamiento.html", aves=aves, voluntarios=voluntarios)


@app.route("/ver-avistamientos", methods=["GET"])
def ver_avistamientos():
    avistamientos_db = db.get_avistamientos()

    data = []
    for av in avistamientos_db:
        # extrae todas las rutas multimedia asociadas en la tabla 'registro'
        archivos_urls = [url_for('static', filename=reg.ruta_archivo) for reg in av.registros]

        data.append({
            "id": av.id,
            "voluntario": av.voluntario.nombre,
            "ave": av.ave.nombre,
            "fecha_hora": av.fecha_hora.strftime("%Y-%m-%d %H:%M"),
            "lugar": av.lugar,
            "descripcion": av.descripcion,
            "archivos": archivos_urls
        })

    return render_template("ver-avistamientos.html", data=data)

@app.route("/metricas", methods=["GET"])
def metricas():
    return render_template("metricas.html")


if __name__ == "__main__":
    app.run(debug=True)