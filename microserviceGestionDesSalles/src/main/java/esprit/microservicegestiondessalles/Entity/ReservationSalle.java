package esprit.microservicegestiondessalles.Entity;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

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
@DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateExamen;

@DateTimeFormat(pattern = "HH:mm")
    private LocalTime heureDebut;

@DateTimeFormat(pattern = "HH:mm")
    private LocalTime heureFin;
    private Long enseignantId;



    @ManyToOne
    @JoinColumn(name = "salle_id")
    private Salle salle;
}
