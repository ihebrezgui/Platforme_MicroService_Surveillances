package esprit.microservice1.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "enseignant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Enseignant {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private Long userId;
    private String matricule;
    private String role;

    @Transient
    private Long moduleId;

    @ManyToOne
    @JoinColumn(name = "module_id")
    @JsonIgnoreProperties("enseignants")
    private MyModule myModule;
}
