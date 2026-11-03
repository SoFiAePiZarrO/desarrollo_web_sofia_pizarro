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
            timeformat: "%d/%m/%y",
            axisLabel: "Fecha",
            axisLabelUseCanvas: true
            },
            yaxis: {
                min: 0,
                tickSize: 1,
                tickDecimals: 0,
                axisLabel: "Cantidad de avistamientos",
                axisLabelUseCanvas: true
            }
        });
    });


// Gráfico de avistamientos por tipo de ave
fetch("/datos-avistamientos-ave")
    .then(response => response.json())
    .then(datos => {
        $.plot("#grafico-torta", datos, {
            series: {
                pie: { show: true }
            }
        });
    });


// Gráfico de voluntarios por comuna
fetch("/datos-voluntarios-comuna")
    .then(response => response.json())
    .then(datos => {

        const barras = datos.map((d, i) => [i, d.cantidad]);
        const comunas = datos.map((d, i) => [i, d.comuna]);

        $.plot("#grafico-barras", [
            {
                data: barras,
                color: "green",
                bars: { show: true, barWidth: 0.6, align: "center" }
            }
        ], {
            xaxis: {
                ticks: comunas,
                axisLabel: "Comuna",
                axisLabelUseCanvas: true
            },
            yaxis: {
                min: 0,
                tickSize: 1,
                tickDecimals: 0,
                axisLabel: "Cantidad de voluntarios",
                axisLabelUseCanvas: true
            }
        });
    });