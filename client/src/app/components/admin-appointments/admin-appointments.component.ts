import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-appointments',
  templateUrl: './admin-appointments.component.html',
  styleUrls: ['./admin-appointments.component.css']
})
export class AdminAppointmentsComponent implements OnInit {
  appointments: any[] = [];
  loading = true;
  statusFilter = '';
  selectedAppointment: any = null;
  showModal = false;
  newStatus = '';
  adminNotes = '';
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    const url = this.statusFilter 
      ? `${this.apiUrl}/admin/appointments?status=${this.statusFilter}`
      : `${this.apiUrl}/admin/appointments`;
    
    
    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Handle both paginated and non-paginated responses
        this.appointments = response.data || response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Appointments error:', error);
        this.notificationService.error('Failed to load appointments: ' + (error.error?.message || error.message));
        this.loading = false;
      }
    });
  }

  filterByStatus(): void {
    this.loadAppointments();
  }

  openStatusModal(appointment: any): void {
    this.selectedAppointment = appointment;
    this.newStatus = appointment.status;
    this.adminNotes = appointment.admin_notes || '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedAppointment = null;
  }

  updateStatus(): void {
    if (!this.selectedAppointment) return;

    this.http.put(`${this.apiUrl}/admin/appointments/${this.selectedAppointment.id}/status`, {
      status: this.newStatus,
      admin_notes: this.adminNotes
    }).subscribe({
      next: () => {
        this.notificationService.success('Appointment status updated successfully!');
        this.closeModal();
        this.loadAppointments();
      },
      error: (error) => {
        this.notificationService.error('Failed to update appointment status. Please try again.');
      }
    });
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'bg-warning text-dark',
      'confirmed': 'bg-success',
      'completed': 'bg-primary',
      'cancelled': 'bg-danger'
    };
    return 'badge ' + (statusClasses[status] || 'bg-secondary');
  }
}
