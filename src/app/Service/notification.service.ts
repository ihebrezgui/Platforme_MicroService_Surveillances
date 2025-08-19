import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private stompClient!: Client;
   private messagesSubject = new Subject<any>();
  public messages$ = this.messagesSubject.asObservable();
  connect(enseignantId: number) {
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8090/ws',
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      console.log('✅ Connected to WebSocket');

      // abonnement spécifique
      this.stompClient.subscribe(`/topic/notifications/52`, (message: Message) => {
        console.log('🔔 Notification received:', message.body);

        // 👉 afficher une notification type "prompt" pendant 10s
        alert(message.body); // simple exemple
        setTimeout(() => {
          console.log('⏱️ Notification auto-close after 10s');
        }, 10000);
      });
    };

    this.stompClient.activate();
  }

  sendNotificationToTeacher(enseignantId: number, message: string) {
    if (this.stompClient.connected) {
      this.stompClient.publish({
        destination: `/app/send-notification/${enseignantId}`,
        body: message,
      });
      console.log(`Notification sent to enseignant ${enseignantId}:`, message);
    }
  }

  disconnect() {
    if (this.stompClient.active) {
      this.stompClient.deactivate();
      console.log('❌ Disconnected from WebSocket');
    }
  }
}
