package esprit.microservicegestiondesfraude.Entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fraude {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String matricule;// Matricule de l'utilisateur qui a signalé
    private Long enseignantId;
    private String type;        // ex: "Absence injustifiée", "Triche", "Falsification"
    private String description;
    private LocalDateTime dateDeclaration;
    @Enumerated(EnumType.STRING)
    private StatutFraude statut;
    private String rapport;
}
