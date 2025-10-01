package esprit.microservicegestiondessalles.Controller;

import com.opencsv.CSVReader;
import esprit.microservicegestiondessalles.Entity.Periode;
import esprit.microservicegestiondessalles.Entity.Session;
import esprit.microservicegestiondessalles.Entity.Module;
import esprit.microservicegestiondessalles.Entity.TypeSession;
import esprit.microservicegestiondessalles.Service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    // ✅ Ajouter une session
    @PostMapping
    public ResponseEntity<Session> addSession(@RequestBody Session session) {
        sessionService.addSession(session);
        return ResponseEntity.ok(session);
    }

    // ✅ Supprimer une session
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Récupérer une session par ID
    @GetMapping("/{id}")
    public ResponseEntity<Session> getSessionById(@PathVariable Long id) {
        Session session = sessionService.getSessionById(id);
        return session != null ? ResponseEntity.ok(session) : ResponseEntity.notFound().build();
    }

    // ✅ Récupérer toutes les sessions
    @GetMapping
    public ResponseEntity<List<Session>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    // ✅ Mettre à jour une session
    @PutMapping("/{id}")
    public ResponseEntity<Session> updateSession(@PathVariable Long id, @RequestBody Session session) {
        Session existing = sessionService.getSessionById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        session.setId(id); // pour s'assurer que l'ID reste le même
        Session updated = sessionService.updateSession(session);
        return ResponseEntity.ok(updated);
    }

    // ✅ Assigner des modules à une session
    @PostMapping("/{sessionId}/modules")
    public ResponseEntity<Session> assignModulesToSession(
            @PathVariable Long sessionId, 
            @RequestBody List<Long> moduleIds) {
        System.out.println("Received request to assign modules to session: " + sessionId);
        System.out.println("Module IDs: " + moduleIds);
        
        Session updatedSession = sessionService.assignModulesToSession(sessionId, moduleIds);
        
        if (updatedSession != null) {
            System.out.println("Successfully assigned modules to session: " + updatedSession.getId());
            return ResponseEntity.ok(updatedSession);
        } else {
            System.out.println("Failed to assign modules - session not found: " + sessionId);
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Récupérer les modules d'une session
    @GetMapping("/{sessionId}/modules")
    public ResponseEntity<List<Long>> getSessionModules(@PathVariable Long sessionId) {
        List<Long> moduleIds = sessionService.getSessionModules(sessionId);
        return ResponseEntity.ok(moduleIds);
    }

    // ✅ Supprimer un module d'une session
    @DeleteMapping("/{sessionId}/modules/{moduleId}")
    public ResponseEntity<Void> removeModuleFromSession(
            @PathVariable Long sessionId, 
            @PathVariable Long moduleId) {
        boolean success = sessionService.removeModuleFromSession(sessionId, moduleId);
        return success ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/import/csv")
    public ResponseEntity<?> importSessionsFromCsv(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Le fichier est vide"));
            }

            if (!file.getOriginalFilename().endsWith(".csv")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Le fichier doit être au format CSV"));
            }

            List<Session> importedSessions = new ArrayList<>();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
                String[] line;
                int lineNumber = 0;

                while ((line = reader.readNext()) != null) {
                    lineNumber++;

                    // Ignorer les lignes vides
                    if (line.length == 0 || (line.length == 1 && line[0].trim().isEmpty())) {
                        continue;
                    }

                    // Vérifier le nombre de colonnes
                    if (line.length != 5) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "message", "Ligne " + lineNumber + ": Format incorrect. Attendu: 5 colonnes (nom_session, periode, typeSession, dateDebut, dateFin)"
                        ));
                    }

                    Session session = new Session();
                    session.setNom_session(line[0].trim());

                    // Valider et définir la période (Enum Periode)
                    String periodeStr = line[1].trim().toUpperCase();
                    Periode periodeEnum;
                    try {
                        periodeEnum = Periode.valueOf(periodeStr);
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "message", "Ligne " + lineNumber + ": Période invalide. Attendu: PERIODE_1, PERIODE_2, PERIODE_3 ou PERIODE_4"
                        ));
                    }
                    session.setPeriode(periodeEnum);

                    // Valider et définir le type de session (Enum TypeSession)
                    String typeSessionStr = line[2].trim().toUpperCase();
                    TypeSession typeSessionEnum;
                    try {
                        typeSessionEnum = TypeSession.valueOf(typeSessionStr);
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "message", "Ligne " + lineNumber + ": Type de session invalide. Attendu: NORMALE ou RATTRAPAGE"
                        ));
                    }
                    session.setTypeSession(typeSessionEnum);

                    // Parser les dates
                    try {
                        LocalDate dateDebut = LocalDate.parse(line[3].trim(), formatter);
                        LocalDate dateFin = LocalDate.parse(line[4].trim(), formatter);

                        if (dateFin.isBefore(dateDebut)) {
                            return ResponseEntity.badRequest().body(Map.of(
                                    "message", "Ligne " + lineNumber + ": La date de fin doit être après la date de début"
                            ));
                        }

                        session.setDateDebut(dateDebut);
                        session.setDateFin(dateFin);
                    } catch (Exception e) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "message", "Ligne " + lineNumber + ": Format de date invalide. Attendu: yyyy-MM-dd (ex: 2024-01-15)"
                        ));
                    }

                    // Sauvegarder la session
                    Session saved = sessionService.updateSession(session);
                    importedSessions.add(saved);
                }

                    if (importedSessions.isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Aucune session valide trouvée dans le fichier"));
                }

                return ResponseEntity.ok(importedSessions);

            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Erreur lors de la lecture du fichier: " + e.getMessage()));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erreur lors de l'import: " + e.getMessage()));
        }
    }
}




