package esprit.microservice1.Entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "unite_pedagogique")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnitePedagogique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codeUP;
    private String libelle;
    private String codeUE;
    private String libelleUE;

}
