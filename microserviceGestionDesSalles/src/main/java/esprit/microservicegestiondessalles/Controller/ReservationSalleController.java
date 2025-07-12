    package esprit.microservicegestiondessalles.Controller;

    import esprit.microservicegestiondessalles.Entity.HistoriqueReservation;
    import esprit.microservicegestiondessalles.Entity.ReservationSalle;
    import esprit.microservicegestiondessalles.Service.ReservationSalleService;
    import lombok.AllArgsConstructor;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/reservations")
    @AllArgsConstructor
    @CrossOrigin("*")
    public class ReservationSalleController {

        private final ReservationSalleService reservationService;

        @GetMapping("/salle/{salleId}")
        public List<ReservationSalle> getReservationsBySalle(@PathVariable Long salleId) {
            return reservationService.getReservationsBySalle(salleId);
        }

        @PostMapping("/{matricule}")
        public ReservationSalle createReservation(@RequestBody ReservationSalle reservation,
                                                  @PathVariable String matricule,
                                                  @RequestParam(defaultValue = "création") String typeAction) {
            return reservationService.createReservation(reservation, matricule, typeAction);
        }

        @PutMapping("/{id}/{matricule}")
        public ReservationSalle updateReservation(@PathVariable Long id,
                                                  @RequestBody ReservationSalle reservation,
                                                  @PathVariable String matricule,
                                                  @RequestParam(defaultValue = "modification") String typeAction) {
            return reservationService.updateReservation(id, reservation, matricule, typeAction);
        }

        @DeleteMapping("/{id}/{matricule}")
        public ResponseEntity<?> deleteReservation(@PathVariable Long id,
                                                   @PathVariable String matricule) {
            reservationService.deleteReservation(id, matricule);
            return ResponseEntity.ok().build();
        }

        @GetMapping("/historique/{reservationId}")
        public List<HistoriqueReservation> getHistorique(@PathVariable Long reservationId) {
            return reservationService.getHistoriqueByReservation(reservationId);
        }
    }
