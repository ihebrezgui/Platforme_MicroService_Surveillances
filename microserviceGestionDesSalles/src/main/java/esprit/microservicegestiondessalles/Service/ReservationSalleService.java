package esprit.microservicegestiondessalles.Service;

import esprit.microservicegestiondessalles.EnseignantClient;
import esprit.microservicegestiondessalles.EnseignantDTO;
import esprit.microservicegestiondessalles.Entity.HistoriqueReservation;
import esprit.microservicegestiondessalles.Entity.ReservationSalle;
import esprit.microservicegestiondessalles.Entity.Salle;
import esprit.microservicegestiondessalles.Repository.EmploiDuTempsRepository;
import esprit.microservicegestiondessalles.Repository.HistoriqueReservationRepository;
import esprit.microservicegestiondessalles.Repository.ReservationSalleRepository;
import esprit.microservicegestiondessalles.Repository.SalleRepository;
import esprit.microservicegestiondessalles.UserClient;
import esprit.microservicegestiondessalles.UserDTO;
import feign.FeignException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@AllArgsConstructor
public class ReservationSalleService {

    private final ReservationSalleRepository reservationRepository;
    private final HistoriqueReservationRepository historiqueRepository;
    private final EmploiDuTempsRepository emploiDuTempsRepository;
    private final SalleRepository salleRepository;
    private final UserClient userClient;
    private final EnseignantClient enseignantClient;

    public List<ReservationSalle> getReservationsBySalle(Long salleId) {
        return reservationRepository.findBySalleIdOrderByDateExamenAsc(salleId);
    }

    public Long getUserIdByMatricule(String matricule) {
        UserDTO user = userClient.getUserByMatricule(matricule);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé avec matricule : " + matricule);
        }
        return user.getId();
    }


    public boolean isEnseignantDisponible(Long enseignantId, LocalDate date, LocalTime debut, LocalTime fin) {
        int emploiConflits = emploiDuTempsRepository.countConflits(enseignantId, date, debut, fin);
        int reservationConflits = reservationRepository.countConflits(enseignantId, date, debut, fin);
        return emploiConflits == 0 && reservationConflits == 0;
    }

    public ReservationSalle createReservation(ReservationSalle reservation, String matricule, String typeAction) {
        Long salleId = reservation.getSalle().getId();
        LocalDate date = reservation.getDateExamen();
        LocalTime debut = reservation.getHeureDebut();
        LocalTime fin = reservation.getHeureFin();

        int nbEnseignants = reservationRepository.countEnseignantsReservantSallePourPeriode(salleId, date, debut, fin);
        if (nbEnseignants >= 2) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Limite de 2 enseignants maximum pour cette salle et ce créneau atteinte.");
        }

        EnseignantDTO enseignant;
        try {
            enseignant = enseignantClient.getEnseignantByMatricule(matricule);
        } catch (FeignException e) {
            if (e.status() == 404) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Enseignant non trouvé avec matricule : " + matricule);
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur lors de la récupération de l'enseignant.");
            }
        }

        if (!isEnseignantDisponible(enseignant.getId(), date, debut, fin)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enseignant non disponible sur ce créneau.");
        }

        reservation.setEnseignantId(enseignant.getId());

        Salle salle = salleRepository.findById(salleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Salle non trouvée avec id : " + salleId));
        reservation.setSalle(salle);

        ReservationSalle saved = reservationRepository.save(reservation);

        HistoriqueReservation historique = HistoriqueReservation.builder()
                .dateModification(LocalDateTime.now())
                .typeAction(typeAction)
                .utilisateurId(enseignant.getUserId())
                .reservation(saved)
                .build();
        historiqueRepository.save(historique);

        return saved;
    }



public ReservationSalle updateReservation(Long id, ReservationSalle reservationDetails, String matricule, String typeAction) {
        Long utilisateurId = getUserIdByMatricule(matricule);

        ReservationSalle reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec id : " + id));

        reservation.setDateExamen(reservationDetails.getDateExamen());
        reservation.setHeureDebut(reservationDetails.getHeureDebut());
        reservation.setHeureFin(reservationDetails.getHeureFin());
        reservation.setEnseignantId(reservationDetails.getEnseignantId());

        reservation.setSalle(reservationDetails.getSalle());

        ReservationSalle updated = reservationRepository.save(reservation);

        HistoriqueReservation historique = HistoriqueReservation.builder()
                .dateModification(LocalDateTime.now())
                .typeAction(typeAction)  // ex: "modification"
                .utilisateurId(utilisateurId)
                .reservation(updated)
                .build();
        historiqueRepository.save(historique);

        return updated;
    }

    public void deleteReservation(Long id, String matricule) {
        Long utilisateurId = getUserIdByMatricule(matricule);

        ReservationSalle reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec id : " + id));

        reservationRepository.deleteById(id);

        HistoriqueReservation historique = HistoriqueReservation.builder()
                .dateModification(LocalDateTime.now())
                .typeAction("suppression")
                .utilisateurId(utilisateurId)
                .reservation(reservation)
                .build();
        historiqueRepository.save(historique);
    }

    public List<HistoriqueReservation> getHistoriqueByReservation(Long reservationId) {
        return historiqueRepository.findByReservationIdOrderByDateModificationDesc(reservationId);
    }



}
