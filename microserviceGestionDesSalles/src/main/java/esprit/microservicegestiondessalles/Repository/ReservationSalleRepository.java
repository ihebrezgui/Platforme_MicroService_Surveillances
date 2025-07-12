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



    @Query("""
    select count(distinct r.enseignantId)
    from ReservationSalle r
    where r.salle.id = :salleId
      and r.dateExamen = :date
      and (r.heureDebut < :heureFin and r.heureFin > :heureDebut)
""")
    int countEnseignantsReservantSallePourPeriode(@Param("salleId") Long salleId,
                                                  @Param("date") LocalDate date,
                                                  @Param("heureDebut") LocalTime heureDebut,
                                                  @Param("heureFin") LocalTime heureFin);

}