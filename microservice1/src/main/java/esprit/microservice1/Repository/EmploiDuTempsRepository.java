package esprit.microservice1.Repository;


import esprit.microservice1.Entity.EmploiDuTemps;
import esprit.microservice1.Entity.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmploiDuTempsRepository extends JpaRepository<EmploiDuTemps, Long> {

    List<EmploiDuTemps> findByEnseignantId(Long enseignantId);

    List<EmploiDuTemps> findByJour(LocalDate jour);

    List<EmploiDuTemps> findBySalle(String salle);

}
