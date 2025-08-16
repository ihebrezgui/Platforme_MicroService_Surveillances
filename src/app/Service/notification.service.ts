import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private stompClient!: Client;

  connect() {
    this.stompClient = new Client({
      brokerURL: 'http://localhost:8090/ws-support', // WebSocket natif
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');

      this.stompClient.subscribe('/topic/notifications', (message: Message) => {
        console.log('Notification received:', message.body);
      });
    };

    this.stompClient.activate();
  }

  sendNotification(message: string) {
    if (this.stompClient.connected) {
      this.stompClient.publish({ destination: '/app/send-notification', body: message });
      console.log('Notification sent:', message);
    } else {
      console.warn('WebSocket not connected');
    }
  }

  disconnect() {
    if (this.stompClient.active) {
      this.stompClient.deactivate();
      console.log('Disconnected from WebSocket');
    }
  }
}
