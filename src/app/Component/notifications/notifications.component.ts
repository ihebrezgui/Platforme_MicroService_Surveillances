// src/app/components/notifications/notifications.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../Service/notification.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: true,     
  imports: [CommonModule] 
})
export class NotificationsComponent implements OnInit {
  notification: string | null = null;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
  }
}
