package esprit.microservice1.Entity;

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
    private Long telephone;
    private String Module;
    private Long userId;
    private String matricule;
    private String role;
}
