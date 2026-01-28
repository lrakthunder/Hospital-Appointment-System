import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorAppointmentService } from '../../services/doctor-appointment.service';
import { NotificationService } from '../../services/notification.service';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit, OnDestroy {
  patient: any = null;
  appointments: any[] = [];
  totalAppointments = 0;
  completedAppointments = 0;
  loading = true;
  showViewNoteModal = false;
  viewingNote = '';
  isEditingViewNote = false;
  viewNoteAppointment: any = null;
  editor!: Editor;
  toolbar: any = [
    ['bold', 'italic', 'underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3'] }],
    ['link'],
    ['code', 'blockquote']
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorAppointmentService: DoctorAppointmentService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.editor = new Editor();
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadPatientDetails(+userId);
    }
  }

  stripHtml(html: string): string {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  loadPatientDetails(userId: number): void {
    this.loading = true;
    this.doctorAppointmentService.getPatientDetails(userId).subscribe({
      next: (data) => {
        this.patient = data.patient;
        this.appointments = data.appointments;
        this.totalAppointments = data.total_appointments;
        this.completedAppointments = data.completed_appointments;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Failed to load patient details');
        this.loading = false;
        this.router.navigate(['/doctor/dashboard']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/doctor/dashboard']);
  }

  openViewNoteModal(appointment: any): void {
    this.viewingNote = appointment.doctor_notes || '';
    this.viewNoteAppointment = appointment;
    this.isEditingViewNote = false;
    this.showViewNoteModal = true;
  }

  closeViewNoteModal(): void {
    this.showViewNoteModal = false;
    this.viewingNote = '';
    this.isEditingViewNote = false;
    this.viewNoteAppointment = null;
  }

  enableEditViewNote(): void {
    this.isEditingViewNote = true;
  }

  saveViewNote(): void {
    if (!this.viewNoteAppointment) return;

    this.doctorAppointmentService.addNotes(this.viewNoteAppointment.id, this.viewingNote).subscribe({
      next: () => {
        this.notificationService.success('Notes updated successfully!');
        this.closeViewNoteModal();
        const userId = this.route.snapshot.paramMap.get('id');
        if (userId) {
          this.loadPatientDetails(+userId);
        }
      },
      error: (error) => {
        this.notificationService.error('Failed to update notes');
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
    return statusClasses[status] || 'bg-secondary';
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}

