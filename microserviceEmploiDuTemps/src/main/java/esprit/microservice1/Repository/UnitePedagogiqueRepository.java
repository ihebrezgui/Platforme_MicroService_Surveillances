package esprit.microservice1.Repository;

import esprit.microservice1.Entity.UnitePedagogique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UnitePedagogiqueRepository extends JpaRepository<UnitePedagogique, Long> {

}
