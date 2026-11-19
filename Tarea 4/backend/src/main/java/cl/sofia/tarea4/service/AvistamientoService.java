
package cl.sofia.tarea4.service;

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

    public List<Avistamiento> buscar(String texto) {
        return avistamientoRepository.buscarPorTexto(texto);
    }

    public Double calcularPromedio(Integer avistamientoId) {
        return notaRepository.calcularPromedio(avistamientoId);
    }
}
