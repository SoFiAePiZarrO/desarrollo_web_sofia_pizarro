
package cl.sofia.tarea4.controller;

import cl.sofia.tarea4.dto.AvistamientoDTO;
import cl.sofia.tarea4.service.AvistamientoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/avistamientos")
@CrossOrigin
public class AvistamientoController {

    private final AvistamientoService avistamientoService;

    public AvistamientoController(AvistamientoService avistamientoService) {
        this.avistamientoService = avistamientoService;
    }

    @GetMapping("/buscar")
    public List<AvistamientoDTO> buscar(@RequestParam String texto) {
        return avistamientoService.buscar(texto);
    }
}
