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

// Validar que solo contenga letras, tildes, espacios y ñ (mínimo 2 caracteres)
const validarNombre = (nombre) => {
  if (!nombre || nombre.trim().length === 0) {
    return { esValido: false, mensaje: "Este campo es obligatorio." };
  }
  const textoLimpio = nombre.trim();
  if (textoLimpio.length < 2) {
    return { esValido: false, mensaje: "Ingrese un nombre válido." };
  }
  const expresionLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!expresionLetras.test(textoLimpio)) {
    return { esValido: false, mensaje: "Ingrese un nombre válido." };
  }
  return { esValido: true, mensaje: "" };
};

// Prevenir código malicioso
const esEntradaSegura = (texto) => {
  if (!texto) return true;
  const caracteresProhibidos = /[<>{}]|javascript:/i;
  return !caracteresProhibidos.test(texto);
};

// Validar RUT chileno
const validarRUT = (rut) => {
  if (!rut || rut.trim().length === 0) {
    return { esValido: false, mensaje: "El RUT es obligatorio." };
  }

  const rutLimpio = rut.replace(/\./g, "").trim();
  if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutLimpio)) {
    return { esValido: false, mensaje: "Formato inválido. Ejemplo: 12345678-9" };
  }

  const partes = rutLimpio.split("-");
  let digitoVerificador = partes[1];
  const numeroRut = partes[0];
  if (digitoVerificador === "K") digitoVerificador = "k";

  let suma = 0;
  let multiplicador = 2;

  for (let i = numeroRut.length - 1; i >= 0; i--) {
    suma += parseInt(numeroRut.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const digitoEsperadoCalculado = 11 - resto;
  let digitoEsperado = "";

  if (digitoEsperadoCalculado === 11) {
    digitoEsperado = "0";
  } else if (digitoEsperadoCalculado === 10) {
    digitoEsperado = "k";
  } else {
    digitoEsperado = digitoEsperadoCalculado.toString();
  }

  if (digitoEsperado !== digitoVerificador) {
    return { esValido: false, mensaje: "El RUT ingresado no es válido." };
  }

  return { esValido: true, mensaje: "" };
};

// Validar Fecha de Nacimiento
const validarFechaNacimiento = (fechaTexto) => {
  if (!fechaTexto) return { esValido: true, mensaje: "" };

  const fechaNacimiento = new Date(fechaTexto);
  const fechaActual = new Date();
  const anioMinimo = 1900;

  if (
    isNaN(fechaNacimiento.getTime()) ||
    fechaNacimiento > fechaActual ||
    fechaNacimiento.getFullYear() < anioMinimo
  ) {
    return { esValido: false, mensaje: "Ingrese una fecha válida" };
  }

  return { esValido: true, mensaje: "" };
};

// Validar Correo Electrónico
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

// Validar Teléfono
const validarTelefono = (telefono) => {
  if (!telefono || telefono.trim().length === 0) {
    return { esValido: false, mensaje: "El número de teléfono es obligatorio." };
  }
  const expresionTelefono = /^(\+?56)?(\s?)(9)(\s?)[0-9]{8}$/;
  if (!expresionTelefono.test(telefono.trim())) {
    return { esValido: false, mensaje: "Ingrese un teléfono válido (ej: +56912345678)." };
  }
  return { esValido: true, mensaje: "" };
};

// Validar Selección de desplegables (Select)
const validarSeleccion = (valor, nombreCampo) => {
  if (!valor || valor.trim() === "") {
    return { esValido: false, mensaje: `Debe seleccionar una opción para ${nombreCampo}.` };
  }
  return { esValido: true, mensaje: "" };
};

// Cargar Regiones y Comunas desde datosUbicacion
document.addEventListener("DOMContentLoaded", () => {
  const selectorRegion = document.getElementById("region");
  const selectorComuna = document.getElementById("comuna");

  if (selectorRegion && typeof datosUbicacion !== "undefined") {
    // Cargar Regiones
    Object.keys(datosUbicacion).forEach((region) => {
      const opcion = document.createElement("option");
      opcion.value = region;
      opcion.textContent = region;
      selectorRegion.appendChild(opcion);
    });

    // Evento para cambiar Comunas según la Región elegida
    selectorRegion.addEventListener("change", () => {
      const regionSeleccionada = selectorRegion.value;
      selectorComuna.innerHTML = '<option value="">Seleccione una comuna</option>';

      if (regionSeleccionada && datosUbicacion[regionSeleccionada]) {
        datosUbicacion[regionSeleccionada].forEach((comuna) => {
          const opcion = document.createElement("option");
          opcion.value = comuna;
          opcion.textContent = comuna;
          selectorComuna.appendChild(opcion);
        });
      } else {
        selectorComuna.innerHTML = '<option value="">Seleccione primero una región</option>';
      }
    });
  }
});

// Evento principal al enviar el formulario
const formulario = document.getElementById("form-voluntario");

if (formulario) {
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    // Obtención de elementos del DOM
    const campoNombres = document.getElementById("nombres");
    const campoApellidos = document.getElementById("apellidos");
    const campoRut = document.getElementById("rut");
    const campoFecha = document.getElementById("fecha-nacimiento");
    const campoCorreo = document.getElementById("email");
    const campoTelefono = document.getElementById("telefono");
    const campoPais = document.getElementById("pais");
    const campoRegion = document.getElementById("region");
    const campoComuna = document.getElementById("comuna");

    const errorNombres = document.getElementById("error-nombres");
    const errorApellidos = document.getElementById("error-apellidos");
    const errorRut = document.getElementById("error-rut");
    const errorFecha = document.getElementById("error-fecha");
    const errorCorreo = document.getElementById("error-email");
    const errorTelefono = document.getElementById("error-telefono");
    const errorPais = document.getElementById("error-pais");
    const errorRegion = document.getElementById("error-region");
    const errorComuna = document.getElementById("error-comuna");

    // Comprobación rápida de código malicioso en campos de texto
    const camposTexto = [campoNombres, campoApellidos, campoRut, campoCorreo, campoTelefono];
    let codigoMaliciosoDetectado = false;

    camposTexto.forEach((campo) => {
      if (campo && !esEntradaSegura(campo.value)) {
        codigoMaliciosoDetectado = true;
      }
    });

    if (codigoMaliciosoDetectado) {
      alert("Se han detectado caracteres o símbolos no permitidos en los campos.");
      return;
    }

    // Validaciones y mensajes de error
    const resultadoNombres = validarNombre(campoNombres ? campoNombres.value : "");
    establecerError(campoNombres, errorNombres, resultadoNombres.esValido, resultadoNombres.mensaje);

    const resultadoApellidos = validarNombre(campoApellidos ? campoApellidos.value : "");
    establecerError(campoApellidos, errorApellidos, resultadoApellidos.esValido, resultadoApellidos.mensaje);

    const resultadoRut = validarRUT(campoRut ? campoRut.value : "");
    establecerError(campoRut, errorRut, resultadoRut.esValido, resultadoRut.mensaje);

    const resultadoFecha = validarFechaNacimiento(campoFecha ? campoFecha.value : "");
    establecerError(campoFecha, errorFecha, resultadoFecha.esValido, resultadoFecha.mensaje);

    const resultadoCorreo = validarCorreo(campoCorreo ? campoCorreo.value : "");
    establecerError(campoCorreo, errorCorreo, resultadoCorreo.esValido, resultadoCorreo.mensaje);

    const resultadoTelefono = validarTelefono(campoTelefono ? campoTelefono.value : "");
    establecerError(campoTelefono, errorTelefono, resultadoTelefono.esValido, resultadoTelefono.mensaje);

    const resultadoPais = validarSeleccion(campoPais ? campoPais.value : "", "país");
    establecerError(campoPais, errorPais, resultadoPais.esValido, resultadoPais.mensaje);

    const resultadoRegion = validarSeleccion(campoRegion ? campoRegion.value : "", "región");
    establecerError(campoRegion, errorRegion, resultadoRegion.esValido, resultadoRegion.mensaje);

    const resultadoComuna = validarSeleccion(campoComuna ? campoComuna.value : "", "comuna");
    establecerError(campoComuna, errorComuna, resultadoComuna.esValido, resultadoComuna.mensaje);

    if (
      !resultadoNombres.esValido ||
      !resultadoApellidos.esValido ||
      !resultadoRut.esValido ||
      !resultadoFecha.esValido ||
      !resultadoCorreo.esValido ||
      !resultadoTelefono.esValido ||
      !resultadoPais.esValido ||
      !resultadoRegion.esValido ||
      !resultadoComuna.esValido
    ) {
      return;
    }

    alert("¡Registro de voluntario exitoso!");
    formulario.reset();
  });
}