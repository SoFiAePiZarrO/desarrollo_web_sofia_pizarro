
const validateSelect = (value) => {
    return value !== null && value !== undefined && value.trim() !== "";
};

const validateNombreAve = (conoceSi, nombre) => {
    if (!conoceSi) return true; // Si seleccionó "No", el nombre no es obligatorio
    return nombre !== null && nombre !== undefined && nombre.trim().length > 0;
};

const validateFecha = (fechaInput) => {
    if (!fechaInput) return false;

    const partes = fechaInput.split("-");
    const fechaSeleccionada = new Date(partes[0], partes[1] - 1, partes[2]);

    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);

    const haceUnAno = new Date();
    haceUnAno.setFullYear(hoy.getFullYear() - 1);
    haceUnAno.setHours(0, 0, 0, 0);

    // Válido solo si está entre hace 1 año y el día de hoy
    return fechaSeleccionada <= hoy && fechaSeleccionada >= haceUnAno;
};

const validateArchivo = (archivoInput) => {
    return archivoInput && archivoInput.files && archivoInput.files.length > 0;
};

const setError = (element, isValid, message) => {
    if (!element) return;
    if (!isValid) {
        element.textContent = message;
        element.classList.add("visible");
    } else {
        element.textContent = "";
        element.classList.remove("visible");
    }
};


const selectRegion = document.getElementById("region-avistamiento");
const selectComuna = document.getElementById("comuna-avistamiento");
const radioConoceSi = document.getElementById("conoce-si");
const radioConoceNo = document.getElementById("conoce-no");
const inputNombreAve = document.getElementById("nombre-ave");
const form = document.getElementById("form-avistamiento");

// Mensajes de error (spans)
const errorTipo = document.getElementById("error-tipo-ave");
const errorNombreAve = document.getElementById("error-nombre-ave");
const errorFecha = document.getElementById("error-fecha");
const errorHora = document.getElementById("error-hora");
const errorRegion = document.getElementById("error-region-avistamiento");
const errorComuna = document.getElementById("error-comuna-avistamiento");
const errorCiudad = document.getElementById("error-ciudad-avistamiento");
const errorMultimedia = document.getElementById("error-multimedia");


const objetoRegiones = typeof regionesComunas !== "undefined" ? regionesComunas : (typeof datosUbicacion !== "undefined" ? datosUbicacion : null);

if (objetoRegiones && selectRegion) {
    for (let region in objetoRegiones) {
        const opcion = document.createElement("option");
        opcion.value = region;
        opcion.textContent = region;
        selectRegion.appendChild(opcion);
    }
}

if (selectRegion && selectComuna) {
    selectRegion.addEventListener("change", () => {
        const regionSeleccionada = selectRegion.value;
        selectComuna.innerHTML = '<option value="">Seleccione una comuna</option>';

        if (regionSeleccionada && objetoRegiones && objetoRegiones[regionSeleccionada]) {
            selectComuna.disabled = false;
            objetoRegiones[regionSeleccionada].forEach((comuna) => {
                const opcion = document.createElement("option");
                opcion.value = comuna;
                opcion.textContent = comuna;
                selectComuna.appendChild(opcion);
            });
        } else {
            selectComuna.disabled = true;
            selectComuna.innerHTML = '<option value="">Seleccione primero una región</option>';
        }
    });
}


if (radioConoceSi && radioConoceNo && inputNombreAve) {
    radioConoceSi.addEventListener("change", () => {
        if (radioConoceSi.checked) {
            inputNombreAve.disabled = false;
            inputNombreAve.focus();
        }
    });

    radioConoceNo.addEventListener("change", () => {
        if (radioConoceNo.checked) {
            inputNombreAve.disabled = true;
            inputNombreAve.value = "";
            if (errorNombreAve) {
                errorNombreAve.textContent = "";
                errorNombreAve.classList.remove("visible");
            }
        }
    });
}


if (form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const tipoInput = document.getElementById("tipo-ave").value;
        const nombreAveInput = inputNombreAve.value;
        const fechaInput = document.getElementById("fecha-avistamiento").value;
        const horaInput = document.getElementById("hora-avistamiento").value;
        const regionInput = selectRegion.value;
        const comunaInput = selectComuna.value;
        const ciudadInput = document.getElementById("ciudad-avistamiento").value;
        const archivoInput = document.getElementById("archivo-multimedia");

        const esTipoValido = validateSelect(tipoInput);
        const esNombreAveValido = validateNombreAve(radioConoceSi.checked, nombreAveInput);
        const esFechaValida = validateFecha(fechaInput);
        const esHoraValida = validateSelect(horaInput);
        const esRegionValida = validateSelect(regionInput);
        const esComunaValida = validateSelect(comunaInput);
        const esCiudadValida = validateSelect(ciudadInput);
        const esArchivoValido = validateArchivo(archivoInput);

        setError(errorTipo, esTipoValido, "Debe seleccionar un tipo de ave.");
        setError(errorNombreAve, esNombreAveValido, "Ingrese el nombre del ave.");
        setError(errorFecha, esFechaValida, "Ingrese una fecha válida (no futura, máx. 1 año atrás).");
        setError(errorHora, esHoraValida, "Ingrese la hora del avistamiento.");
        setError(errorRegion, esRegionValida, "Seleccione una región.");
        setError(errorComuna, esComunaValida, "Seleccione una comuna.");
        setError(errorCiudad, esCiudadValida, "Ingrese una ciudad o localidad.");
        setError(errorMultimedia, esArchivoValido, "Debe adjuntar una imagen o video.");

        // Detener el envío si algún campo no es válido
        if (
            !esTipoValido ||
            !esNombreAveValido ||
            !esFechaValida ||
            !esHoraValida ||
            !esRegionValida ||
            !esComunaValida ||
            !esCiudadValida ||
            !esArchivoValido
        ) {
            return;
        }

        alert("¡Avistamiento registrado con éxito!");

        // Limpiar el formulario y reiniciar estados
        form.reset();
        selectComuna.disabled = true;
        selectComuna.innerHTML = '<option value="">Seleccione primero una región</option>';
        inputNombreAve.disabled = true;
    });
}