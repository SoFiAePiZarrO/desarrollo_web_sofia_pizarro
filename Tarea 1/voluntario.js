
const setError = (inputElement, errorElement, isValid, errorMessage) => {
  if (!errorElement) return;

  if (!isValid) {
    errorElement.textContent = errorMessage;
    errorElement.classList.add("visible");
    if (inputElement) inputElement.classList.add("input-error");
  } else {
    errorElement.textContent = "";
    errorElement.classList.remove("visible");
    if (inputElement) inputElement.classList.remove("input-error");
  }
};

const validateName = (name) => {
  if (!name) return false;
  return name.trim().length >= 2;
};

const validateRUT = (rut) => {
  if (!rut) return false;

  const cleanRut = rut.replace(/\./g, "").trim();
  if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(cleanRut)) return false;

  const tmp = cleanRut.split("-");
  let digv = tmp[1];
  const rutNum = tmp[0];
  if (digv === "K") digv = "k";

  let m = 0,
    s = 1;
  let t = parseInt(rutNum, 10);
  for (; t; t = Math.floor(t / 10)) {
    s = (s + (t % 10) * (9 - (m++ % 6))) % 11;
  }
  const dvEsperado = s ? (s - 1).toString() : "k";
  return dvEsperado === digv;
};

const validateEmail = (email) => {
  if (!email) return false;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email.trim());
};

const validatePhone = (phone) => {
  if (!phone) return false;
  const regexTelefono = /^(\+?56)?(\s?)(9)(\s?)[0-9]{8}$/;
  return regexTelefono.test(phone.trim());
};

const validateSelect = (value) => {
  return value !== null && value !== undefined && value.trim() !== "";
};

const formulario = document.getElementById("form-voluntario");

const errorNombres = document.getElementById("error-nombres");
const errorApellidos = document.getElementById("error-apellidos");
const errorRut = document.getElementById("error-rut");
const errorEmail = document.getElementById("error-email");
const errorTelefono = document.getElementById("error-telefono");
const errorPais = document.getElementById("error-pais");

if (formulario) {
  formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombresInput = document.getElementById("nombres").value;
    const apellidosInput = document.getElementById("apellidos").value;
    const rutInput = document.getElementById("rut").value;
    const emailInput = document.getElementById("email").value;
    const telefonoInput = document.getElementById("telefono").value;
    const paisInput = document.getElementById("pais").value;

    const esNombreValido = validateName(nombresInput);
    const esApellidoValido = validateName(apellidosInput);
    const esRutValido = validateRUT(rutInput);
    const esEmailValido = validateEmail(emailInput);
    const esTelefonoValido = validatePhone(telefonoInput);
    const esPaisValido = validateSelect(paisInput);

    if (!esNombreValido && errorNombres) {
      errorNombres.classList.add("visible");
    } else if (errorNombres) {
      errorNombres.classList.remove("visible");
    }

    if (!esApellidoValido && errorApellidos) {
      errorApellidos.classList.add("visible");
    } else if (errorApellidos) {
      errorApellidos.classList.remove("visible");
    }

    if (!esRutValido && errorRut) {
      errorRut.classList.add("visible");
    } else if (errorRut) {
      errorRut.classList.remove("visible");
    }

    if (!esEmailValido && errorEmail) {
      errorEmail.classList.add("visible");
    } else if (errorEmail) {
      errorEmail.classList.remove("visible");
    }

    if (!esTelefonoValido && errorTelefono) {
      errorTelefono.classList.add("visible");
    } else if (errorTelefono) {
      errorTelefono.classList.remove("visible");
    }

    if (!esPaisValido && errorPais) {
      errorPais.classList.add("visible");
    } else if (errorPais) {
      errorPais.classList.remove("visible");
    }

    if (
      !esNombreValido ||
      !esApellidoValido ||
      !esRutValido ||
      !esEmailValido ||
      !esTelefonoValido ||
      !esPaisValido
    ) {
      return;
    }

    alert("¡Registro de voluntario exitoso!");

    formulario.reset();
  });
}