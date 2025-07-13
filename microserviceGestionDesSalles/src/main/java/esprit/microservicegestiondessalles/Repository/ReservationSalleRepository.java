package esprit.microservicegestiondessalles.Repository;

import esprit.microservicegestiondessalles.Entity.ReservationSalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservationSalleRepository extends JpaRepository<ReservationSalle, Long> {
    List<ReservationSalle> findBySalleIdOrderByDateExamenAsc(Long salleId);



    @Query("SELECT COUNT(r) FROM ReservationSalle r WHERE r.enseignantId = :enseignantId AND r.dateExamen = :date " +
            "AND ( (r.heureDebut < :heureFin) AND (r.heureFin > :heureDebut) )")
    int countConflits(@Param("enseignantId") Long enseignantId,
                      @Param("date") LocalDate date,
                      @Param("heureDebut") LocalTime heureDebut,
                      @Param("heureFin") LocalTime heureFin);

    @Query("SELECT COUNT(r.salle) FROM ReservationSalle r WHERE r.salle.id = :salleId AND r.dateExamen = :date " +
            "AND ( (r.heureDebut < :heureFin) AND (r.heureFin > :heureDebut) )")
    int countEnseignantsReservantSallePourPeriode(@Param("salleId") Long salleId,
                                                  @Param("date") LocalDate date,
                                                  @Param("heureDebut") LocalTime heureDebut,
                                                  @Param("heureFin") LocalTime heureFin);
}