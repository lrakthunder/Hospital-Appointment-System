import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { DoctorAppointmentService, DoctorAppointment } from '../../services/doctor-appointment.service';
import { NotificationService } from '../../services/notification.service';
import { Editor } from 'ngx-editor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit, OnDestroy {
  currentDoctor: User | null = null;
  stats: any = {};
  appointments: DoctorAppointment[] = [];
  filteredAppointments: DoctorAppointment[] = [];
  loading = true;
  statusFilter = '';
  showDeclineModal = false;
  showNotesModal = false;
  selectedAppointment: DoctorAppointment | null = null;
  declineReason = '';
  doctorNotes = '';
  sortColumn: string = 'appointment_date';
  sortDirection: 'asc' | 'desc' = 'asc';
  showViewNoteModal = false;
  viewingNote = '';
  isEditingViewNote = false;
  viewNoteAppointment: DoctorAppointment | null = null;
  editor!: Editor;
  toolbar: any = [
    ['bold', 'italic', 'underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3'] }],
    ['link'],
    ['code', 'blockquote']
  ];
  showAttachmentsModal = false;
  attachmentAppointment: DoctorAppointment | null = null;
  selectedFiles: File[] = [];
  uploadingFiles = false;

  constructor(
    public authService: AuthService,
    private doctorAppointmentService: DoctorAppointmentService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.editor = new Editor();
    this.currentDoctor = this.authService.currentUserValue;
    this.loadStats();
    this.loadAppointments();
  }

  stripHtml(html: string): string {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  loadStats(): void {
    this.doctorAppointmentService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        this.notificationService.error('Failed to load statistics');
      }
    });
  }

  loadAppointments(): void {
    this.loading = true;
    const params = this.statusFilter ? { status: this.statusFilter } : {};
    
    this.doctorAppointmentService.getAppointments(params).subscribe({
      next: (data) => {
        this.appointments = data;
        this.filteredAppointments = data;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Failed to load appointments');
        this.loading = false;
      }
    });
  }

  filterByStatus(): void {
    this.loadAppointments();
  }

  openDeclineModal(appointment: DoctorAppointment): void {
    this.selectedAppointment = appointment;
    this.declineReason = '';
    this.showDeclineModal = true;
  }

  closeDeclineModal(): void {
    this.showDeclineModal = false;
    this.selectedAppointment = null;
    this.declineReason = '';
  }

  confirmDecline(): void {
    if (!this.selectedAppointment || !this.declineReason.trim()) {
      this.notificationService.error('Please provide a reason for declining');
      return;
    }

    this.doctorAppointmentService.declineAppointment(this.selectedAppointment.id, this.declineReason).subscribe({
      next: () => {
        this.notificationService.success('Appointment declined. Patient has been notified via email.');
        this.closeDeclineModal();
        this.loadAppointments();
        this.loadStats();
      },
      error: (error) => {
        this.notificationService.error('Failed to decline appointment');
      }
    });
  }

  confirmAppointment(appointment: DoctorAppointment): void {
    this.doctorAppointmentService.updateStatus(appointment.id, 'confirmed').subscribe({
      next: () => {
        this.notificationService.success('Appointment confirmed successfully!');
        this.loadAppointments();
        this.loadStats();
      },
      error: (error) => {
        this.notificationService.error('Failed to confirm appointment');
      }
    });
  }

  completeAppointment(appointment: DoctorAppointment): void {
    this.doctorAppointmentService.updateStatus(appointment.id, 'completed').subscribe({
      next: () => {
        this.notificationService.success('Appointment marked as completed!');
        this.loadAppointments();
        this.loadStats();
      },
      error: (error) => {
        this.notificationService.error('Failed to complete appointment');
      }
    });
  }

  openNotesModal(appointment: DoctorAppointment): void {
    this.selectedAppointment = appointment;
    this.doctorNotes = appointment.doctor_notes || '';
    this.showNotesModal = true;
  }

  closeNotesModal(): void {
    this.showNotesModal = false;
    this.selectedAppointment = null;
    this.doctorNotes = '';
  }

  saveNotes(): void {
    if (!this.selectedAppointment) return;

    this.doctorAppointmentService.addNotes(this.selectedAppointment.id, this.doctorNotes).subscribe({
      next: () => {
        this.notificationService.success('Notes saved successfully!');
        this.closeNotesModal();
        this.loadAppointments();
      },
      error: (error) => {
        this.notificationService.error('Failed to save notes');
      }
    });
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredAppointments.sort((a: any, b: any) => {
      let valueA = a[column];
      let valueB = b[column];

      // Handle null or undefined values
      if (valueA == null) valueA = '';
      if (valueB == null) valueB = '';

      // Convert to lowercase for string comparison
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      let comparison = 0;
      if (valueA > valueB) {
        comparison = 1;
      } else if (valueA < valueB) {
        comparison = -1;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'bi-arrow-down-up';
    return this.sortDirection === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  }

  openViewNoteModal(appointment: DoctorAppointment): void {
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
        this.loadAppointments();
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

  logout(): void {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#7393b3',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
      }
    });
  }

  openAttachmentsModal(appointment: DoctorAppointment): void {
    this.attachmentAppointment = appointment;
    this.selectedFiles = [];
    this.showAttachmentsModal = true;
  }

  closeAttachmentsModal(): void {
    this.showAttachmentsModal = false;
    this.attachmentAppointment = null;
    this.selectedFiles = [];
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSize) {
        this.notificationService.error(`File "${file.name}" exceeds 25MB limit`);
      } else {
        this.selectedFiles.push(file);
      }
    }
  }

  removeSelectedFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  uploadFiles(): void {
    if (!this.attachmentAppointment || this.selectedFiles.length === 0) return;
    
    this.uploadingFiles = true;
    let uploadedCount = 0;
    const totalFiles = this.selectedFiles.length;
    const appointmentId = this.attachmentAppointment.id;
    
    this.selectedFiles.forEach((file, index) => {
      this.doctorAppointmentService.uploadAttachment(this.attachmentAppointment!.id, file).subscribe({
        next: (attachment) => {
          uploadedCount++;
          if (uploadedCount === totalFiles) {
            this.notificationService.success(`${totalFiles} file(s) uploaded successfully`);
            this.selectedFiles = [];
            this.uploadingFiles = false;
            this.loadAppointments(); // Reload to get updated attachments
            // Refresh the modal data to show new files immediately
            this.doctorAppointmentService.getAppointments().subscribe({
              next: (appointments) => {
                const updatedAppointment = appointments.find(apt => apt.id === appointmentId);
                if (updatedAppointment) {
                  this.attachmentAppointment = updatedAppointment;
                }
              }
            });
          }
        },
        error: (error) => {
          uploadedCount++;
          
          // Detailed error message
          let errorMsg = `Failed to upload ${file.name}`;
          
          if (error.error?.message) {
            errorMsg += `: ${error.error.message}`;
          } else if (error.status === 413 || error.statusText === 'Payload Too Large') {
            errorMsg += `: File size (${this.formatFileSize(file.size)}) exceeds server limit`;
          } else if (error.status === 422) {
            errorMsg += `: File validation failed (max 25MB allowed)`;
          } else {
            errorMsg += `: ${error.statusText || 'Unknown error'}`;
          }
          
          this.notificationService.error(errorMsg);
          
          if (uploadedCount === totalFiles) {
            this.uploadingFiles = false;
          }
        }
      });
    });
  }

  downloadAttachment(appointmentId: number, attachmentId: number, fileName: string): void {
    this.doctorAppointmentService.downloadAttachment(appointmentId, attachmentId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.notificationService.error('Failed to download file');
      }
    });
  }

  deleteAttachment(appointmentId: number, attachmentId: number): void {
    if (!confirm('Are you sure you want to delete this attachment?')) return;
    
    this.doctorAppointmentService.deleteAttachment(appointmentId, attachmentId).subscribe({
      next: () => {
        this.notificationService.success('Attachment deleted successfully');
        this.loadAppointments(); // Reload to get updated attachments
      },
      error: (error) => {
        this.notificationService.error('Failed to delete attachment');
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
