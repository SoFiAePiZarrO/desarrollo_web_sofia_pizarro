// Establece o elimina un error de validación
const establecerError = (elementoEntrada, elementoError, esValido, mensajeError = "") => {
    if (!esValido) {
        elementoError.textContent = mensajeError;
        elementoError.classList.add("visible");
        elementoEntrada.classList.add("input-error");
    } else {
        elementoError.textContent = "";
        elementoError.classList.remove("visible");
        elementoEntrada.classList.remove("input-error");
    }
};

// Cargar comentarios del avistamiento
function cargarComentarios() {
    fetch(`/comentarios/${avistamientoId}`)
        .then(response => response.json())
        .then(comentarios => {
            const lista = document.getElementById("lista-comentarios");
            lista.innerHTML = "";

            if (comentarios.length === 0) {
                lista.textContent = "Todavía no hay comentarios.";
            }

            comentarios.forEach(c => {
                const comentario = document.createElement("p");
                comentario.textContent = `${c.nombre} (${c.fecha}): ${c.texto}`;
                lista.appendChild(comentario);
            });
        });
}

cargarComentarios();

// Enviar un nuevo comentario
document.getElementById("form-comentario").addEventListener("submit", function(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre");
    const texto = document.getElementById("texto");

    const errorNombre = document.getElementById("error-nombre");
    const errorTexto = document.getElementById("error-texto");

    const nombreLimpio = nombre.value.trim();
    const textoLimpio = texto.value.trim();

    const nombreValido = nombreLimpio.length >= 3 && nombreLimpio.length <= 50;
    const textoValido = textoLimpio.length >= 5;

    establecerError(
        nombre, errorNombre, nombreValido,
        "El nombre debe tener entre 3 y 50 caracteres."
    );

    establecerError(
        texto, errorTexto, textoValido,
        "El comentario debe tener al menos 5 caracteres."
    );

    if (!nombreValido || !textoValido) {
        return;
    }

    const datos = {
        nombre: nombreLimpio,
        texto: textoLimpio
    };

    fetch(`/comentarios/${avistamientoId}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(resultado => {
        if (resultado.errores) {
            resultado.errores.forEach(error => {
                if (error.includes("nombre")) {
                    establecerError(nombre, errorNombre, false, error);
                }

                if (error.includes("comentario")) {
                    establecerError(texto, errorTexto, false, error);
                }
            });
        } else {
            document.getElementById("form-comentario").reset();
            cargarComentarios();
        }
    });
});