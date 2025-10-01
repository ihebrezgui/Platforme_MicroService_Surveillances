package esprit.microservice1.Controller;

import esprit.microservice1.Entity.ExamenChrono;
import esprit.microservice1.Entity.ExamenChronoRequestDTO;
import esprit.microservice1.Entity.Groupe;
import esprit.microservice1.Service.ExamenChronoService;
import esprit.microservice1.TeacherSurveillanceDTO;
import esprit.microservice1.SalleReservationDTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/examen-chrono")
@AllArgsConstructor
@CrossOrigin("*")
public class ExamenChronoController {

    private final ExamenChronoService examenChronoService;

    // 👉 Créer un nouvel ExamenChrono
    @PostMapping("/create")
    public ResponseEntity<ExamenChrono> createExamen(@RequestBody ExamenChronoRequestDTO request) {
        try {
            System.out.println("🚀 CONTROLLER: Received exam creation request:");
            System.out.println("🚀 CONTROLLER: Session ID: " + request.getSessionId());
            System.out.println("🚀 CONTROLLER: Module ID: " + request.getModuleId());
            System.out.println("🚀 CONTROLLER: Date: " + request.getDateExamen());
            System.out.println("🚀 CONTROLLER: Period: " + request.getPeriode());
            
            ExamenChrono created = examenChronoService.createExamenChrono(request);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            System.err.println("❌ CONTROLLER ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    // 👉 Lister tous les examens chrono
    @GetMapping("/all")
    public ResponseEntity<List<ExamenChrono>> getAllExams() {
        return ResponseEntity.ok(examenChronoService.getAllChronos());
    }

    // 👉 Obtenir un examen par son ID
    @GetMapping("/{id}")
    public ResponseEntity<ExamenChrono> getExamenById(@PathVariable Long id) {
        ExamenChrono examen = examenChronoService.getById(id);
        if (examen != null) {
            return ResponseEntity.ok(examen);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 👉 Debug endpoint to test validation
    @GetMapping("/debug/sessions")
    public ResponseEntity<String> debugSessions() {
        try {
            examenChronoService.debugListAllSessions();
            return ResponseEntity.ok("Debug information logged to console");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 📊 Afficher le tableau des heures de surveillance par enseignant
    @GetMapping("/surveillance-table")
    public ResponseEntity<String> afficherTableauSurveillance() {
        try {
            examenChronoService.afficherTableauSurveillance();
            return ResponseEntity.ok("Tableau de surveillance affiché dans les logs du serveur");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 📊 Récupérer les heures de surveillance par enseignant (pour le frontend)
    @GetMapping("/teacher-surveillance-hours")
    public ResponseEntity<List<TeacherSurveillanceDTO>> getTeacherSurveillanceHours() {
        try {
            List<TeacherSurveillanceDTO> surveillanceData = examenChronoService.getTeacherSurveillanceHours();
            return ResponseEntity.ok(surveillanceData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // 📊 Récupérer les réservations d'examens pour une salle
    @GetMapping("/salle/{salleId}/reservations")
    public ResponseEntity<List<SalleReservationDTO>> getReservationsBySalleId(@PathVariable Long salleId) {
        try {
            List<SalleReservationDTO> reservations = examenChronoService.getReservationsBySalleId(salleId);
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // 🔔 Test des notifications WebSocket
    @PostMapping("/test-notification/{enseignantId}")
    public ResponseEntity<String> testNotification(@PathVariable Long enseignantId) {
        try {
            examenChronoService.testNotification(enseignantId);
            return ResponseEntity.ok("Test notification sent to enseignant " + enseignantId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 🔔 Test des notifications pour tous les enseignants
    @PostMapping("/test-notification-all")
    public ResponseEntity<String> testNotificationAll() {
        try {
            examenChronoService.testNotificationAll();
            return ResponseEntity.ok("Test notifications sent to all enseignants");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

}
