
const inputBusqueda = document.getElementById("texto-busqueda");
const resultados = document.getElementById("resultados-busqueda");

inputBusqueda.addEventListener("input", buscarAvistamientos);

async function buscarAvistamientos() {
    const texto = inputBusqueda.value.trim();
    resultados.innerHTML = "";

    if (texto === "") return;

    try {
        const respuesta = await fetch(
            `http://localhost:8080/api/avistamientos/buscar?texto=${encodeURIComponent(texto)}`
        );

        if (!respuesta.ok) {
            throw new Error("Error al buscar avistamientos");
        }

        const avistamientos = await respuesta.json();

        if (avistamientos.length === 0) {
            resultados.textContent = "No se encontraron avistamientos.";
            return;
        }

        avistamientos.forEach(avistamiento => {
            const elemento = document.createElement("div");
            elemento.className = "resultado-avistamiento";

            const voluntario = document.createElement("p");
            voluntario.innerHTML = "<strong>Voluntario:</strong> ";
            voluntario.appendChild(resaltar(avistamiento.voluntario, texto));

            const fecha = document.createElement("p");
            fecha.innerHTML = "<strong>Fecha:</strong> ";
            fecha.appendChild(document.createTextNode(formatearFecha(avistamiento.fechaHora)));

            const ave = document.createElement("p");
            ave.innerHTML = "<strong>Ave:</strong> ";
            ave.appendChild(resaltar(avistamiento.ave, texto));

            const comuna = document.createElement("p");
            comuna.innerHTML = "<strong>Comuna:</strong> ";
            comuna.appendChild(resaltar(avistamiento.comuna, texto));

            const evaluacion = document.createElement("p");
            evaluacion.innerHTML = "<strong>Evaluación:</strong> ";

            const promedio = document.createElement("span");
            promedio.textContent = avistamiento.promedio === null
                ? "-"
                : avistamiento.promedio.toFixed(1);

            evaluacion.appendChild(promedio);

            const botonEvaluar = document.createElement("button");
            botonEvaluar.type = "button";
            botonEvaluar.textContent = "Evaluar";

            const controles = document.createElement("div");

            botonEvaluar.addEventListener("click", () => {
                controles.innerHTML = "";

                const selector = document.createElement("select");
                selector.innerHTML = '<option value="">Selecciona una nota</option>';

                for (let i = 1; i <= 7; i++) {
                    const opcion = document.createElement("option");
                    opcion.value = i;
                    opcion.textContent = i;
                    selector.appendChild(opcion);
                }

                const botonGuardar = document.createElement("button");
                botonGuardar.type = "button";
                botonGuardar.textContent = "Guardar";

                const mensaje = document.createElement("p");

                botonGuardar.addEventListener("click", async () => {
                    const nota = Number(selector.value);

                    if (!selector.value || nota < 1 || nota > 7 || !Number.isInteger(nota)) {
                        mensaje.textContent = "Selecciona una nota entre 1 y 7.";
                        return;
                    }

                    botonGuardar.disabled = true;

                    try {
                        const respuesta = await fetch(
                            `http://localhost:8080/api/notas?avistamientoId=${avistamiento.id}&nota=${nota}`,
                            { method: "POST" }
                        );

                        if (!respuesta.ok) {
                            const error = await respuesta.text();
                            throw new Error(error);
                        }

                        const nuevoPromedio = await respuesta.json();
                        promedio.textContent = nuevoPromedio.toFixed(1);

                        controles.innerHTML = "";
                        mensaje.textContent = "Evaluación guardada correctamente.";

                    } catch (error) {
                        mensaje.textContent = "No fue posible guardar la evaluación.";
                        console.error(error);
                        botonGuardar.disabled = false;
                    }
                });

                controles.append(selector, botonGuardar, mensaje);
            });

            elemento.append(
                voluntario,
                fecha,
                ave,
                comuna,
                evaluacion,
                botonEvaluar,
                controles
            );

            resultados.appendChild(elemento);
        });

    } catch (error) {
        resultados.textContent = "No fue posible realizar la búsqueda.";
        console.error(error);
    }
}

function resaltar(texto, busqueda) {
    const fragmento = document.createDocumentFragment();
    const posicion = texto.toLowerCase().indexOf(busqueda.toLowerCase());

    if (posicion === -1) {
        fragmento.appendChild(document.createTextNode(texto));
        return fragmento;
    }

    fragmento.appendChild(document.createTextNode(texto.substring(0, posicion)));

    const destacado = document.createElement("strong");
    destacado.className = "texto-destacado";
    destacado.textContent = texto.substring(posicion, posicion + busqueda.length);
    fragmento.appendChild(destacado);

    fragmento.appendChild(document.createTextNode(texto.substring(posicion + busqueda.length)));

    return fragmento;
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString("es-CL");
}
