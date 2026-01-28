import { Component, OnInit } from '@angular/core';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { DateFormatter } from '../../helpers/date-formatter.helper';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = true;

  constructor(private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getMyAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string | undefined): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'bg-warning text-dark',
      'confirmed': 'bg-success',
      'completed': 'bg-primary',
      'cancelled': 'bg-danger'
    };
    return statusClasses[status || 'pending'] || 'bg-secondary';
  }

  formatDate(dateString: string | undefined): string {
    return DateFormatter.formatDate(dateString);
  }

  formatDateTime(dateString: string | undefined, timeString: string | undefined): string {
    return DateFormatter.formatDateTime(dateString, timeString);
  }
}
