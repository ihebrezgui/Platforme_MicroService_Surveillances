package esprit.microservicegestiondessalles;

import lombok.Data;

@Data
public class GroupeDTO {
    private Long id;
    private String nomClasse;
    private String niveau;
    private String optionGroupe;
    private int effectif;
    private String departement;

    public String getDepartement() {
        return departement;
    }

    public void setDepartement(String departement) {
        this.departement = departement;
    }

    public int getEffectif() {
        return effectif;
    }

    public void setEffectif(int effectif) {
        this.effectif = effectif;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNiveau() {
        return niveau;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }

    public String getNomClasse() {
        return nomClasse;
    }

    public void setNomClasse(String nomClasse) {
        this.nomClasse = nomClasse;
    }

    public String getOptionGroupe() {
        return optionGroupe;
    }

    public void setOptionGroupe(String optionGroupe) {
        this.optionGroupe = optionGroupe;
    }
}