package esprit.microservice1.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "module")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyModule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codeModule;
    private String libelleModule;
    private int semestre;
    private int coef;


    @ManyToOne
    @JoinColumn(name = "unite_pedagogique_id")
    @JsonIgnoreProperties("modules")
    private UnitePedagogique unitePedagogique;



    @OneToMany(mappedBy = "myModule", cascade = CascadeType.ALL)
    private List<Enseignant> enseignants; // ⚠️ Liste des enseignants du module
}
