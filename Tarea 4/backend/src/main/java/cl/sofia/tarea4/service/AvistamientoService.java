
package cl.sofia.tarea4.service;

import cl.sofia.tarea4.dto.AvistamientoDTO;
import cl.sofia.tarea4.entity.Avistamiento;
import cl.sofia.tarea4.repository.AvistamientoRepository;
import cl.sofia.tarea4.repository.NotaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AvistamientoService {

    private final AvistamientoRepository avistamientoRepository;
    private final NotaRepository notaRepository;

    public AvistamientoService(AvistamientoRepository avistamientoRepository,
                               NotaRepository notaRepository) {
        this.avistamientoRepository = avistamientoRepository;
        this.notaRepository = notaRepository;
    }

    public List<AvistamientoDTO> buscar(String texto) {
        List<Avistamiento> avistamientos = avistamientoRepository.buscarPorTexto(texto);

        return avistamientos.stream().map(a -> new AvistamientoDTO(
                a.getId(),
                a.getVoluntario().getNombre(),
                a.getFechaHora(),
                a.getAve().getNombre(),
                a.getVoluntario().getComuna().getNombre(),
                notaRepository.calcularPromedio(a.getId())
        )).toList();
    }
}
