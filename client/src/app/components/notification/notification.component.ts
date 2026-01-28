import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Array<Notification & { id: number }> = [];
  private subscription!: Subscription;
  private idCounter = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe(notification => {
      const id = this.idCounter++;
      const notificationWithId = { ...notification, id };
      this.notifications.push(notificationWithId);

      setTimeout(() => {
        this.removeNotification(id);
      }, notification.duration || 3000);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  removeNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '';
    }
  }
}
