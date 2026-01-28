import { Component, OnInit } from '@angular/core';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { NotificationService } from '../../services/notification.service';
import { DateFormatter } from '../../helpers/date-formatter.helper';

@Component({
  selector: 'app-appointment-history',
  templateUrl: './appointment-history.component.html',
  styleUrls: ['./appointment-history.component.css']
})
export class AppointmentHistoryComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = true;

  constructor(
    private appointmentService: AppointmentService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.appointmentService.getAppointmentHistory().subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Failed to load appointment history. Please try again.');
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string | undefined): string {
    return `badge badge-${status}`;
  }

  formatDate(dateString: string | undefined): string {
    return DateFormatter.formatDate(dateString);
  }

  formatDateTime(dateString: string | undefined, timeString: string | undefined): string {
    return DateFormatter.formatDateTime(dateString, timeString);
  }
}
