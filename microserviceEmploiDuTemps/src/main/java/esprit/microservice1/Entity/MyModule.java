package esprit.microservice1.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private Long id;  // DB PK


    private String codeModule;
    private String libelleModule;

    // ✨ AJOUTER CES NOUVEAUX CHAMPS
    @Enumerated(EnumType.STRING)
    @Column(name = "type_epreuve")
    private TypeEpreuve typeEpreuve;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_module")
    private TypeModule typeModule;



    @ManyToOne
    @JoinColumn(name = "unite_pedagogique_id")
    @JsonIgnoreProperties("modules")
    private UnitePedagogique unitePedagogique;







}
