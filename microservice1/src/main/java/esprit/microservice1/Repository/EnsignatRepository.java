package esprit.microservice1.Repository;

import esprit.microservice1.Entity.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface EnsignatRepository extends JpaRepository<Enseignant, Long> {
}
