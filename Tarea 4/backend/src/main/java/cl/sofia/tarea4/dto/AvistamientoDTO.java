
package cl.sofia.tarea4.dto;

import java.time.LocalDateTime;

public class AvistamientoDTO {

    private Integer id;
    private String voluntario;
    private LocalDateTime fechaHora;
    private String ave;
    private String comuna;
    private Double promedio;

    public AvistamientoDTO(Integer id, String voluntario, LocalDateTime fechaHora,
                           String ave, String comuna, Double promedio) {
        this.id = id;
        this.voluntario = voluntario;
        this.fechaHora = fechaHora;
        this.ave = ave;
        this.comuna = comuna;
        this.promedio = promedio;
    }

    public Integer getId() {
        return id;
    }

    public String getVoluntario() {
        return voluntario;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public String getAve() {
        return ave;
    }

    public String getComuna() {
        return comuna;
    }

    public Double getPromedio() {
        return promedio;
    }
}
