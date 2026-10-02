const validarSeleccion = (valor) => {
    return valor !== null && valor !== undefined && valor.trim() !== "";
};

const validarNombreAve = (conoceSi, nombre) => {
    if (!conoceSi) return true; // Si eligió "No", no se exige el nombre
    return nombre !== null && nombre !== undefined && nombre.trim().length > 0;
};

const validarFecha = (fechaTexto) => {
    if (!fechaTexto) return false;

    const partes = fechaTexto.split("-");
    const fechaSeleccionada = new Date(partes[0], partes[1] - 1, partes[2]);

    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);

    const haceUnAno = new Date();
    haceUnAno.setFullYear(hoy.getFullYear() - 1);
    haceUnAno.setHours(0, 0, 0, 0);

    return fechaSeleccionada <= hoy && fechaSeleccionada >= haceUnAno;
};

// Validación del archivo
const validarArchivo = (entradaArchivo) => {
    if (!entradaArchivo || !entradaArchivo.files || entradaArchivo.files.length === 0) {
        return { esValido: false, mensaje: "Debe adjuntar una imagen o video." };
    }

    const archivo = entradaArchivo.files[0];
    const tipoArchivo = archivo.type; // Ejemplo: 'image/png', 'video/mp4'

    // Formatos permitidos
    const esImagen = tipoArchivo.startsWith("image/");
    const esVideo = tipoArchivo.startsWith("video/");

    if (!esImagen && !esVideo) {
        return { esValido: false, mensaje: "Formato no permitido. Debe subir un archivo de imagen o video." };
    }

    return { esValido: true, mensaje: "" };
};

const establecerError = (elemento, esValido, mensaje) => {
    if (!elemento) return;
    if (!esValido) {
        elemento.textContent = mensaje;
        elemento.classList.add("visible");
    } else {
        elemento.textContent = "";
        elemento.classList.remove("visible");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const selectorRegion = document.getElementById("region-avistamiento");
    const selectorComuna = document.getElementById("comuna-avistamiento");
    const radioConoceSi = document.getElementById("conoce-si");
    const radioConoceNo = document.getElementById("conoce-no");
    const entradaNombreAve = document.getElementById("nombre-ave");
    const formulario = document.getElementById("form-avistamiento");

    // Spans para mostrar mensajes de error
    const errorTipo = document.getElementById("error-tipo-ave");
    const errorNombreAve = document.getElementById("error-nombre-ave");
    const errorFecha = document.getElementById("error-fecha");
    const errorHora = document.getElementById("error-hora");
    const errorRegion = document.getElementById("error-region-avistamiento");
    const errorComuna = document.getElementById("error-comuna-avistamiento");
    const errorCiudad = document.getElementById("error-ciudad-avistamiento");
    const errorMultimedia = document.getElementById("error-multimedia");

    // Carga de regiones y comunas
    const objetoUbicacion = typeof datosUbicacion !== "undefined" ? datosUbicacion : (typeof regionesComunas !== "undefined" ? regionesComunas : null);

    if (objetoUbicacion && selectorRegion) {
        Object.keys(objetoUbicacion).forEach((region) => {
            const opcion = document.createElement("option");
            opcion.value = region;
            opcion.textContent = region;
            selectorRegion.appendChild(opcion);
        });
    }

    if (selectorRegion && selectorComuna) {
        selectorRegion.addEventListener("change", () => {
            const regionSeleccionada = selectorRegion.value;
            selectorComuna.innerHTML = '<option value="">Seleccione una comuna</option>';

            if (regionSeleccionada && objetoUbicacion && objetoUbicacion[regionSeleccionada]) {
                selectorComuna.disabled = false;
                objetoUbicacion[regionSeleccionada].forEach((comuna) => {
                    const opcion = document.createElement("option");
                    opcion.value = comuna;
                    opcion.textContent = comuna;
                    selectorComuna.appendChild(opcion);
                });
            } else {
                selectorComuna.disabled = true;
                selectorComuna.innerHTML = '<option value="">Seleccione primero una región</option>';
            }
        });
    }

    // Comportamiento del radio button para habilitar/deshabilitar el nombre del ave
    if (radioConoceSi && radioConoceNo && entradaNombreAve) {
        radioConoceSi.addEventListener("change", () => {
            if (radioConoceSi.checked) {
                entradaNombreAve.disabled = false;
                entradaNombreAve.focus();
            }
        });

        radioConoceNo.addEventListener("change", () => {
            if (radioConoceNo.checked) {
                entradaNombreAve.disabled = true;
                entradaNombreAve.value = "";
                if (errorNombreAve) {
                    errorNombreAve.textContent = "";
                    errorNombreAve.classList.remove("visible");
                }
            }
        });
    }

    // Validación al enviar el formulario
    if (formulario) {
        formulario.addEventListener("submit", (evento) => {
            evento.preventDefault();

            const entradaTipo = document.getElementById("tipo-ave").value;
            const entradaNombre = entradaNombreAve.value;
            const entradaFecha = document.getElementById("fecha-avistamiento").value;
            const entradaHora = document.getElementById("hora-avistamiento").value;
            const entradaRegion = selectorRegion.value;
            const entradaComuna = selectorComuna.value;
            const entradaCiudad = document.getElementById("ciudad-avistamiento").value;
            const entradaArchivo = document.getElementById("archivo-multimedia");

            const esTipoValido = validarSeleccion(entradaTipo);
            const esNombreAveValido = validarNombreAve(radioConoceSi.checked, entradaNombre);
            const esFechaValida = validarFecha(entradaFecha);
            const esHoraValida = validarSeleccion(entradaHora);
            const esRegionValida = validarSeleccion(entradaRegion);
            const esComunaValida = validarSeleccion(entradaComuna);
            const esCiudadValida = validarSeleccion(entradaCiudad);
            
            // Validar existencia y tipo MIME del archivo
            const resultadoArchivo = validarArchivo(entradaArchivo);

            establecerError(errorTipo, esTipoValido, "Debe seleccionar un tipo de ave.");
            establecerError(errorNombreAve, esNombreAveValido, "Ingrese el nombre del ave.");
            establecerError(errorFecha, esFechaValida, "Ingrese una fecha válida.");
            establecerError(errorHora, esHoraValida, "Ingrese la hora del avistamiento.");
            establecerError(errorRegion, esRegionValida, "Seleccione una región.");
            establecerError(errorComuna, esComunaValida, "Seleccione una comuna.");
            establecerError(errorCiudad, esCiudadValida, "Ingrese una ciudad o localidad.");
            
            // Establecer el mensaje de error específico según lo devuelto por validarArchivo
            establecerError(errorMultimedia, resultadoArchivo.esValido, resultadoArchivo.mensaje);

            if (
                !esTipoValido ||
                !esNombreAveValido ||
                !esFechaValida ||
                !esHoraValida ||
                !esRegionValida ||
                !esComunaValida ||
                !esCiudadValida ||
                !resultadoArchivo.esValido
            ) {
                return;
            }

            alert("¡Avistamiento registrado con éxito!");

            // Limpiar el formulario
            formulario.reset();
            selectorComuna.disabled = true;
            selectorComuna.innerHTML = '<option value="">Seleccione primero una región</option>';
            entradaNombreAve.disabled = true;
        });
    }
});