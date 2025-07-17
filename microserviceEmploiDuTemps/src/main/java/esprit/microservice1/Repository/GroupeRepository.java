package esprit.microservice1.Repository;

import esprit.microservice1.Entity.Groupe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface GroupeRepository extends JpaRepository<Groupe, Long> {
}
