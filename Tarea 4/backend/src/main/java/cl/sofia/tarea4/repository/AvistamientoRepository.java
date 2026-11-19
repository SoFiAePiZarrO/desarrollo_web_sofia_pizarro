
package cl.sofia.tarea4.repository;

import cl.sofia.tarea4.entity.Avistamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AvistamientoRepository extends JpaRepository<Avistamiento, Integer> {

    @Query("SELECT a FROM Avistamiento a " +
           "JOIN a.ave ave " +
           "JOIN a.voluntario v " +
           "JOIN v.comuna c " +
           "WHERE LOWER(ave.nombre) LIKE LOWER(CONCAT('%', :texto, '%')) " +
           "OR LOWER(v.nombre) LIKE LOWER(CONCAT('%', :texto, '%')) " +
           "OR LOWER(c.nombre) LIKE LOWER(CONCAT('%', :texto, '%'))")
    List<Avistamiento> buscarPorTexto(@Param("texto") String texto);
}
