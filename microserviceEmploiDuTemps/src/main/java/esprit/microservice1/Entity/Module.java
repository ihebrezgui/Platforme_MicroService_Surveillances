package esprit.microservice1.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "module")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Module {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codeModule;
    private String libelleModule;
    private int semestre;
    private int coef;


    @ManyToOne
    @JoinColumn(name = "unite_pedagogique_id")
    private UnitePedagogique unitePedagogique;
}
