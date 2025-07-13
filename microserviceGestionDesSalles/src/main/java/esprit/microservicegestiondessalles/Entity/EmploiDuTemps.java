
package esprit.microservicegestiondessalles.Entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "emploi_Enseignant")
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
    private LocalDate date;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private String typeActivite; // cours, soutenance, surveillance, etc.


}
