package esprit.microservice1.Service;

import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@Service
@AllArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final RestTemplate restTemplate = new RestTemplate();

    // Envoie une notif à un utilisateur spécifique
    public void notifyEnseignant(Long enseignantId, String message) {
        System.out.println("🔔 NOTIFICATION: Sending to enseignant ID: " + enseignantId + " with message: " + message);

        try {
            // Méthode 1: Utiliser convertAndSendToUser (nécessite que l'utilisateur soit connecté)
            messagingTemplate.convertAndSendToUser(
                    enseignantId.toString(),
                    "/queue/notifications",
                    message
            );
            System.out.println("✅ NOTIFICATION: WebSocket user-specific sent to enseignant " + enseignantId);

            // Méthode 2: Envoyer aussi sur le topic spécifique comme fallback
            messagingTemplate.convertAndSend(
                    "/topic/enseignant/" + enseignantId,
                    message
            );
            System.out.println("✅ NOTIFICATION: WebSocket topic-specific sent to enseignant " + enseignantId);

            // Méthode 3: Envoyer aussi sur le topic général (broadcast)
            messagingTemplate.convertAndSend(
                    "/topic/notifications",
                    "Notification pour enseignant " + enseignantId + ": " + message
            );
            System.out.println("✅ NOTIFICATION: WebSocket broadcast sent");

            // Méthode 4: Fallback HTTP si WebSocket échoue
            sendNotificationViaHttp(enseignantId, message);

        } catch (Exception e) {
            System.err.println("❌ NOTIFICATION ERROR: " + e.getMessage());
            e.printStackTrace();
            
            // Fallback HTTP en cas d'erreur WebSocket
            sendNotificationViaHttp(enseignantId, message);
        }

        System.out.println("✅ NOTIFICATION: All methods attempted for enseignant ID: " + enseignantId);
    }

    // Fallback HTTP pour envoyer les notifications
    private void sendNotificationViaHttp(Long enseignantId, String message) {
        try {
            // Créer un payload pour l'API de notification
            Map<String, Object> payload = new HashMap<>();
            payload.put("enseignantId", enseignantId);
            payload.put("message", message);
            payload.put("timestamp", System.currentTimeMillis());
            payload.put("type", "exam_assignment");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            // Envoyer à l'API de notification (si elle existe)
            String notificationUrl = "http://localhost:8090/notifications/send";
            
            try {
                ResponseEntity<String> response = restTemplate.postForEntity(notificationUrl, request, String.class);
                System.out.println("✅ NOTIFICATION HTTP: Sent via HTTP to enseignant " + enseignantId + " - " + response.getStatusCode());
            } catch (Exception e) {
                System.out.println("⚠️ NOTIFICATION HTTP: HTTP fallback not available - " + e.getMessage());
            }

        } catch (Exception e) {
            System.err.println("❌ NOTIFICATION HTTP ERROR: " + e.getMessage());
        }
    }

    // Méthode pour tester les notifications
    public void testNotification(Long enseignantId) {
        String testMessage = "Test notification - " + System.currentTimeMillis();
        notifyEnseignant(enseignantId, testMessage);
    }
}
