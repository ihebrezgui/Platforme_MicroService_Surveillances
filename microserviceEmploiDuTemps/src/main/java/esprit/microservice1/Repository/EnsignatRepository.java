package esprit.microservice1.Repository;

import esprit.microservice1.Entity.EmploiDuTemps;
import esprit.microservice1.Entity.Enseignant;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface EnsignatRepository extends JpaRepository<Enseignant, Long> {




    @Query("SELECT e.id FROM Enseignant e")
    List<Long> findAllIds();

    Optional<Enseignant> findByMatricule(String matricule);



}
