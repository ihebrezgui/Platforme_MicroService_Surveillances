package esprit.microservice1.Repository;


import esprit.microservice1.Entity.EmploiDuTemps;
import esprit.microservice1.Entity.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface EmploiDuTempsRepository extends JpaRepository<EmploiDuTemps, Long> {



    List<EmploiDuTemps> findByEnseignantIdAndDateBetween(Long enseignantId, LocalDate debut, LocalDate fin);
    List<EmploiDuTemps> findByEnseignantId(Long enseignantId);
    List<EmploiDuTemps> findBySalleId(Long salleId);

    @Query("""
    SELECT COUNT(DISTINCT e.enseignant.id)
    FROM EmploiDuTemps e
    WHERE e.salleId = :salleId
      AND e.date = :date
      AND e.heureDebut < :heureFin
      AND e.heureFin > :heureDebut
""")
    int countEnseignantsAffectesSallePeriode(@Param("salleId") Long salleId,
                                             @Param("date") LocalDate date,
                                             @Param("heureDebut") LocalTime heureDebut,
                                             @Param("heureFin") LocalTime heureFin);

}