
package cl.sofia.tarea4.controller;

import cl.sofia.tarea4.service.NotaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notas")
@CrossOrigin
public class NotaController {

    private final NotaService notaService;

    public NotaController(NotaService notaService) {
        this.notaService = notaService;
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestParam Integer avistamientoId,
                                     @RequestParam Integer nota) {
        try {
            Double promedio = notaService.guardar(avistamientoId, nota);
            return ResponseEntity.ok(promedio);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
