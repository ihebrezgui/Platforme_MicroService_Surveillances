package esprit.microservicegestiondesfraude.Repository;


import esprit.microservicegestiondesfraude.Entity.Fraude;
import esprit.microservicegestiondesfraude.Entity.StatutFraude;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FraudeRepository  extends JpaRepository<Fraude, Long> {

    List<Fraude> findByMatricule(String matricule);
    List<Fraude> findByStatut(StatutFraude statut);
}
