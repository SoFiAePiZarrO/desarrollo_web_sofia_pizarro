const establecerError = (elementoEntrada, elementoError, esValido, mensajeError = "") => {
  if (!elementoError) return;

  if (!esValido) {
    elementoError.textContent = mensajeError;
    elementoError.classList.add("visible");
    if (elementoEntrada) elementoEntrada.classList.add("input-error");
  } else {
    elementoError.textContent = "";
    elementoError.classList.remove("visible");
    if (elementoEntrada) elementoEntrada.classList.remove("input-error");
  }
};

// Validar nombre
const validarNombre = (nombre) => {
  if (!nombre || nombre.trim().length === 0) {
    return { esValido: false, mensaje: "El nombre es obligatorio." };
  }

  const textoLimpio = nombre.trim();

  if (textoLimpio.length < 2) {
    return { esValido: false, mensaje: "Ingrese un nombre válido." };
  }

  const expresionLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  if (!expresionLetras.test(textoLimpio)) {
    return { esValido: false, mensaje: "El nombre solo puede contener letras y espacios." };
  }

  return { esValido: true, mensaje: "" };
};

// Prevenir código malicioso
const esEntradaSegura = (texto) => {
  if (!texto) return true;
  const caracteresProhibidos = /[<>{}]|javascript:/i;
  return !caracteresProhibidos.test(texto);
};

// Validar correo electrónico
const validarCorreo = (correo) => {
  if (!correo || correo.trim().length === 0) {
    return { esValido: false, mensaje: "El correo electrónico es obligatorio." };
  }

  const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!expresionCorreo.test(correo.trim())) {
    return { esValido: false, mensaje: "Ingrese un correo válido (ej: usuario@dominio.cl)." };
  }

  return { esValido: true, mensaje: "" };
};

// Validar teléfono
const validarTelefono = (telefono) => {
  if (!telefono || telefono.trim().length === 0) {
    return { esValido: true, mensaje: "" };
  }

  const expresionTelefono = /^\+569[0-9]{8}$/;

  if (!expresionTelefono.test(telefono.trim())) {
    return { esValido: false, mensaje: "Ingrese un teléfono válido (ej: +56912345678)." };
  }

  return { esValido: true, mensaje: "" };
};

// Validar selección
const validarSeleccion = (valor, nombreCampo) => {
  if (!valor || valor.trim() === "") {
    return { esValido: false, mensaje: `Debe seleccionar una opción para ${nombreCampo}.` };
  }

  return { esValido: true, mensaje: "" };
};

// Cargar comunas según la región seleccionada
const campoRegion = document.getElementById("region");
const campoComuna = document.getElementById("comuna");

if (campoRegion && campoComuna) {
  campoRegion.addEventListener("change", async () => {
    const regionId = campoRegion.value;

    campoComuna.innerHTML = '<option value="">Seleccione una comuna</option>';

    if (!regionId) return;

    try {
      const respuesta = await fetch(`/get-comunas/${regionId}`);

      if (!respuesta.ok) {
        throw new Error("Error al obtener las comunas.");
      }

      const comunas = await respuesta.json();

      comunas.forEach((comuna) => {
        const opcion = document.createElement("option");
        opcion.value = comuna.id;
        opcion.textContent = comuna.nombre;
        campoComuna.appendChild(opcion);
      });

    } catch (error) {
      console.error("Error al cargar las comunas:", error);
      campoComuna.innerHTML = '<option value="">Error al cargar comunas</option>';
    }
  });
}

// Evento principal al enviar el formulario
const formulario = document.getElementById("form-voluntario");

if (formulario) {
  formulario.addEventListener("submit", (evento) => {
    const campoNombre = document.getElementById("nombre");
    const campoCorreo = document.getElementById("email");
    const campoTelefono = document.getElementById("telefono");
    const campoRegion = document.getElementById("region");
    const campoComuna = document.getElementById("comuna");

    const errorNombre = document.getElementById("error-nombres");
    const errorCorreo = document.getElementById("error-email");
    const errorTelefono = document.getElementById("error-telefono");
    const errorRegion = document.getElementById("error-region");
    const errorComuna = document.getElementById("error-comuna");

    // Comprobar entradas maliciosas
    const camposTexto = [campoNombre, campoCorreo, campoTelefono];

    for (const campo of camposTexto) {
      if (campo && !esEntradaSegura(campo.value)) {
        evento.preventDefault();
        alert("Se han detectado caracteres o símbolos no permitidos.");
        return;
      }
    }

    // Validaciones
    const resultadoNombre = validarNombre(campoNombre.value);
    establecerError(campoNombre, errorNombre, resultadoNombre.esValido, resultadoNombre.mensaje);

    const resultadoCorreo = validarCorreo(campoCorreo.value);
    establecerError(campoCorreo, errorCorreo, resultadoCorreo.esValido, resultadoCorreo.mensaje);

    const resultadoTelefono = validarTelefono(campoTelefono.value);
    establecerError(campoTelefono, errorTelefono, resultadoTelefono.esValido, resultadoTelefono.mensaje);

    const resultadoRegion = validarSeleccion(campoRegion.value, "región");
    establecerError(campoRegion, errorRegion, resultadoRegion.esValido, resultadoRegion.mensaje);

    const resultadoComuna = validarSeleccion(campoComuna.value, "comuna");
    establecerError(campoComuna, errorComuna, resultadoComuna.esValido, resultadoComuna.mensaje);

    // Si algún campo falla, se detiene el envío
    if (
      !resultadoNombre.esValido ||
      !resultadoCorreo.esValido ||
      !resultadoTelefono.esValido ||
      !resultadoRegion.esValido ||
      !resultadoComuna.esValido
    ) {
      evento.preventDefault();
    }
  });
}