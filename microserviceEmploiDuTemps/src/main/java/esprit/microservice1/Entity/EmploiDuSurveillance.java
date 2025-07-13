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
public class EmploiDuSurveillance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private Long salleId;
    private String matiere;
    private LocalDate date;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private String typeEpreuve; // ex : cours, TD, TP
    private int semestre;
    private int coef;
    private int charge;
    @Column(name = "reservation_id")
    private Long reservationId;

    @ManyToOne
    @JoinColumn(name = "enseignant_id")
    private Enseignant enseignant;

    @ManyToOne
    @JoinColumn(name = "groupe_id")
    private Groupe groupe;

    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module module;




}
