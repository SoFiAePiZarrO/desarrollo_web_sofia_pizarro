
package cl.sofia.tarea4.service;

import cl.sofia.tarea4.entity.Avistamiento;
import cl.sofia.tarea4.entity.Nota;
import cl.sofia.tarea4.repository.AvistamientoRepository;
import cl.sofia.tarea4.repository.NotaRepository;
import org.springframework.stereotype.Service;

@Service
public class NotaService {

    private final NotaRepository notaRepository;
    private final AvistamientoRepository avistamientoRepository;

    public NotaService(NotaRepository notaRepository,
                       AvistamientoRepository avistamientoRepository) {
        this.notaRepository = notaRepository;
        this.avistamientoRepository = avistamientoRepository;
    }

    public Double guardar(Integer avistamientoId, Integer nota) {

        if (nota == null || nota < 1 || nota > 7) {
            throw new IllegalArgumentException("La nota debe estar entre 1 y 7");
        }

        Avistamiento avistamiento = avistamientoRepository.findById(avistamientoId)
                .orElseThrow(() -> new IllegalArgumentException("Avistamiento no encontrado"));

        Nota nuevaNota = new Nota();
        nuevaNota.setAvistamiento(avistamiento);
        nuevaNota.setNota(nota);

        notaRepository.save(nuevaNota);

        return notaRepository.calcularPromedio(avistamientoId);
    }
}
