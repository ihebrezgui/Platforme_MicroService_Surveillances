package esprit.microservicegestiondessalles.Entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "salles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Salle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nom;
    private int capacite;

    private String bloc;
    private int etage;
}
