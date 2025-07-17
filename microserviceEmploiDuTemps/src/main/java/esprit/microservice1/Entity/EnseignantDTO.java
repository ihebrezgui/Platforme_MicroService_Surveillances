package esprit.microservice1.Entity;


import lombok.Data;

@Data
public class EnseignantDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String matricule;
    private String role;
    private String moduleLibelle;
    private Long moduleId; // le nom du module
    private String unitePedagogiqueLibelle;

    public String getUnitePedagogiqueLibelle() {
        return unitePedagogiqueLibelle;
    }

    public void setUnitePedagogiqueLibelle(String unitePedagogiqueLibelle) {
        this.unitePedagogiqueLibelle = unitePedagogiqueLibelle;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMatricule() {
        return matricule;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public String getModuleLibelle() {
        return moduleLibelle;
    }

    public void setModuleLibelle(String moduleLibelle) {
        this.moduleLibelle = moduleLibelle;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
}