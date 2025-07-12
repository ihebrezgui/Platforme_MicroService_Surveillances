package esprit.microservicegestiondessalles.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "reservations_salle")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationSalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate dateExamen;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private Long enseignantId;
    private String unitePedagogique;
    private String etat;

    @ManyToOne
    @JoinColumn(name = "salle_id")
    private Salle salle;
}
