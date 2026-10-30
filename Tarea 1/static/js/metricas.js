// Gráfico de avistamientos por día
fetch("/datos-avistamientos-dia")
    .then(response => response.json())
    .then(datos => {

        const puntos = datos.map(d => [
            new Date(d.fecha + "T00:00:00Z").getTime(),
            d.cantidad
        ]);

        $.plot("#grafico-lineas", [
            {
                data: puntos,
                color: "green",
                lines: { show: true },
                points: { show: true }
            }
        ], {
            xaxis: {
            mode: "time",
            timeBase: "milliseconds",
            timeformat: "%d/%m/%y"
            },
            yaxis: {
                min: 0,
                tickSize: 1,
                tickDecimals: 0
            }
        });
    });