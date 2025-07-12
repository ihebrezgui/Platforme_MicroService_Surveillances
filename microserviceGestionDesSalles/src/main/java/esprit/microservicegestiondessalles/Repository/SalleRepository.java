package esprit.microservicegestiondessalles.Repository;

import esprit.microservicegestiondessalles.Entity.Salle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalleRepository extends JpaRepository<Salle, Long> {}
