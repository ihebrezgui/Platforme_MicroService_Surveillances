package esprit.microservice1.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "emploi_du_temps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmploiDuTemps {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long enseignantId;
    private String matricule;
    private String enseignantNom;
    private LocalDate jour;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private String salle;
    private String matiere;
    private String groupe;
    private String typeCours; // ex : cours, TD, TP

}
