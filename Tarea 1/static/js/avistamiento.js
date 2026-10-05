const validarSeleccion = (valor) => {
    return valor !== null &&
           valor !== undefined &&
           valor.trim() !== "";
};


const validarFechaHora = (fechaHora) => {
    if (!fechaHora) {
        return false;
    }

    const fechaSeleccionada = new Date(fechaHora);
    const ahora = new Date();

    // Fecha mínima: exactamente un mes antes
    const haceUnMes = new Date();
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);

    // No puede ser futura ni anterior a un mes
    return fechaSeleccionada <= ahora &&
           fechaSeleccionada >= haceUnMes;
};


const validarArchivos = (entradaArchivo) => {

    if (
        !entradaArchivo ||
        !entradaArchivo.files ||
        entradaArchivo.files.length === 0
    ) {
        return {
            esValido: false,
            mensaje: "Debe adjuntar al menos una imagen o video."
        };
    }

    // Revisamos todos los archivos seleccionados
    for (const archivo of entradaArchivo.files) {

        const esImagen = archivo.type.startsWith("image/");
        const esVideo = archivo.type.startsWith("video/");

        if (!esImagen && !esVideo) {
            return {
                esValido: false,
                mensaje: "Solo se permiten imágenes o videos."
            };
        }
    }

    return {
        esValido: true,
        mensaje: ""
    };
};


document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("form-avistamiento");

    if (!formulario) {
        return;
    }

    formulario.addEventListener("submit", (evento) => {

        const voluntario = document.getElementById("voluntario");
        const ave = document.getElementById("ave");
        const fechaHora = document.getElementById("fecha_hora");
        const lugar = document.getElementById("lugar");
        const archivos = document.getElementById("archivo-multimedia");

        let errores = [];

        // Voluntario
        if (!voluntario || !validarSeleccion(voluntario.value)) {
            errores.push("Debe seleccionar un voluntario.");
        }

        // Ave
        if (!ave || !validarSeleccion(ave.value)) {
            errores.push("Debe seleccionar una especie de ave.");
        }

        // Fecha y hora
        if (!fechaHora || !validarFechaHora(fechaHora.value)) {
            errores.push("La fecha del avistamiento no puede ser futura ni tener más de un mes de antigüedad.");
        }

        // Lugar
        if (!lugar || !validarSeleccion(lugar.value)) {
            errores.push("Debe ingresar el lugar del avistamiento.");
        }

        // Multimedia
        const resultadoArchivos = validarArchivos(archivos);

        if (!resultadoArchivos.esValido) {
            errores.push(resultadoArchivos.mensaje);
        }

        // Si hay errores, impedimos el post
        if (errores.length > 0) {

            evento.preventDefault();

            alert(
                "Por favor corrija los siguientes errores:\n\n" +
                errores.join("\n")
            );

            return;
        }
    });
});