package esprit.microservicegestiondessalles.Service;


import esprit.microservicegestiondessalles.Entity.Salle;
import esprit.microservicegestiondessalles.Repository.ReservationSalleRepository;
import esprit.microservicegestiondessalles.Repository.SalleRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class SalleService {

    @Autowired
    private SalleRepository salleRepository;


    private final ReservationSalleRepository reservationSalleRepository;

    public List<Salle> getAllSalles() {
        return salleRepository.findAll();
    }

    public Optional<Salle> getSalleById(Long id) {
        return salleRepository.findById(id);
    }

    public Salle createSalle(Salle salle) {
        return salleRepository.save(salle);
    }

    public Salle updateSalle(Long id, Salle salleDetails) {
        Salle salle = salleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Salle non trouvée"));

        salle.setNom(salleDetails.getNom());
        salle.setCapacite(salleDetails.getCapacite());
        salle.setBloc(salleDetails.getBloc());
        salle.setEtage(salleDetails.getEtage());

        return salleRepository.save(salle);
    }

    public void deleteSalle(Long id) {
        salleRepository.deleteById(id);
    }



    public boolean verifierDisponibiliteSalle(Long salleId, LocalDate date, LocalTime heureDebut, LocalTime heureFin) {
        int nombreEnseignants = reservationSalleRepository.countEnseignantsReservantSallePourPeriode(salleId, date, heureDebut, heureFin);
        return nombreEnseignants < 2;
    }

}
