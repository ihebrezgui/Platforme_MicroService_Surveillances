package esprit.microservicegestiondessalles.Service;

import esprit.microservicegestiondessalles.EnseignantClient;
import esprit.microservicegestiondessalles.EnseignantDTO;
import esprit.microservicegestiondessalles.Entity.HistoriqueReservation;
import esprit.microservicegestiondessalles.Entity.ReservationSalle;
import esprit.microservicegestiondessalles.Entity.Salle;
import esprit.microservicegestiondessalles.Repository.HistoriqueReservationRepository;
import esprit.microservicegestiondessalles.Repository.ReservationSalleRepository;
import esprit.microservicegestiondessalles.Repository.SalleRepository;
import esprit.microservicegestiondessalles.UserClient;
import esprit.microservicegestiondessalles.UserDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@AllArgsConstructor
public class ReservationSalleService {

    private final ReservationSalleRepository reservationRepository;
    private final HistoriqueReservationRepository historiqueRepository;
    private final SalleRepository salleRepository;
    private final UserClient userClient;
    private final EnseignantClient enseignantClient;

    public List<ReservationSalle> getReservationsBySalle(Long salleId) {
        return reservationRepository.findBySalleIdOrderByDateExamenAsc(salleId);
    }

    public Long getUserIdByMatricule(String matricule) {
        UserDTO user = userClient.getUserByMatricule(matricule);
        if (user == null) {
            throw new RuntimeException("Utilisateur non trouvé avec matricule : " + matricule);
        }
        return user.getId();
    }

    public ReservationSalle createReservation(ReservationSalle reservation, String matricule, String typeAction) {
        Long salleId = reservation.getSalle().getId();
        LocalDate date = reservation.getDateExamen();
        LocalTime debut = reservation.getHeureDebut();
        LocalTime fin = reservation.getHeureFin();

        // Vérifier le nombre d'enseignants déjà réservés
        int nbEnseignants = reservationRepository.countEnseignantsReservantSallePourPeriode(salleId, date, debut, fin);
        if (nbEnseignants >= 2) {
            throw new RuntimeException("Limite de 2 enseignants maximum pour cette salle et ce créneau atteinte.");
        }

        // ✅ Récupérer l'enseignant via son matricule
        EnseignantDTO enseignant = enseignantClient.getEnseignantByMatricule(matricule);
        if (enseignant == null) {
            throw new RuntimeException("Enseignant non trouvé avec matricule : " + matricule);
        }

        // Mettre à jour l'enseignantId avec l'ID réel de l'enseignant (pas user_id)
        reservation.setEnseignantId(enseignant.getId());

        // Récupérer la salle depuis le repo
        Salle salle = salleRepository.findById(salleId)
                .orElseThrow(() -> new RuntimeException("Salle non trouvée avec id : " + salleId));
        reservation.setSalle(salle);

        // Sauvegarde de la réservation
        ReservationSalle saved = reservationRepository.save(reservation);

        // Historiser l'action
        HistoriqueReservation historique = HistoriqueReservation.builder()
                .dateModification(LocalDateTime.now())
                .typeAction(typeAction)
                .utilisateurId(enseignant.getUserId()) // ici on peut aussi stocker l'utilisateur lié si nécessaire
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
        reservation.setUnitePedagogique(reservationDetails.getUnitePedagogique()); // adapte si tu as unitePedagogiqueId
        reservation.setEtat(reservationDetails.getEtat());
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
