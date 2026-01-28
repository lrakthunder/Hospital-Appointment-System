import { Component, OnInit } from '@angular/core';
import { DoctorService, Doctor } from '../../services/doctor.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-doctors',
  templateUrl: './admin-doctors.component.html',
  styleUrls: ['./admin-doctors.component.css']
})
export class AdminDoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  loading = true;
  showModal = false;
  isEditMode = false;
  selectedDoctor: Doctor | null = null;

  doctorForm = {
    name: '',
    email: '',
    phone: '',
    department: '',
    specialization: '',
    license_number: '',
    years_of_experience: 0,
    consultation_fee: 0,
    available_days: 'Monday,Tuesday,Wednesday,Thursday,Friday',
    available_time_start: '09:00',
    available_time_end: '17:00',
    bio: '',
    status: 'active' as 'active' | 'inactive'
  };

  departments = [
    'Cardiology',
    'Dermatology',
    'Emergency Medicine',
    'Gynecology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry'
  ];

  constructor(
    private doctorService: DoctorService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.loading = true;
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Failed to load doctors. Please try again.');
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedDoctor = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(doctor: Doctor): void {
    this.isEditMode = true;
    this.selectedDoctor = doctor;
    this.doctorForm = {
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      department: doctor.department,
      specialization: doctor.specialization,
      license_number: doctor.license_number,
      years_of_experience: doctor.years_of_experience,
      consultation_fee: doctor.consultation_fee,
      available_days: doctor.available_days,
      available_time_start: doctor.available_time_start.substring(0, 5),
      available_time_end: doctor.available_time_end.substring(0, 5),
      bio: doctor.bio || '',
      status: doctor.status
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.doctorForm = {
      name: '',
      email: '',
      phone: '',
      department: '',
      specialization: '',
      license_number: '',
      years_of_experience: 0,
      consultation_fee: 0,
      available_days: 'Monday,Tuesday,Wednesday,Thursday,Friday',
      available_time_start: '09:00',
      available_time_end: '17:00',
      bio: '',
      status: 'active'
    };
  }

  saveDoctor(): void {
    if (this.isEditMode && this.selectedDoctor) {
      this.doctorService.updateDoctor(this.selectedDoctor.id, this.doctorForm).subscribe({
        next: (response) => {
          this.notificationService.success('Doctor updated successfully!');
          this.closeModal();
          this.loadDoctors();
        },
        error: (error) => {
          this.notificationService.error(error.error?.message || 'Failed to update doctor. Please try again.');
        }
      });
    } else {
      this.doctorService.createDoctor(this.doctorForm).subscribe({
        next: (response) => {
          this.notificationService.success('Doctor added successfully!');
          this.closeModal();
          this.loadDoctors();
        },
        error: (error) => {
          this.notificationService.error(error.error?.message || 'Failed to add doctor. Please try again.');
        }
      });
    }
  }

  deleteDoctor(doctor: Doctor): void {
    if (confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)) {
      this.doctorService.deleteDoctor(doctor.id).subscribe({
        next: () => {
          this.notificationService.success('Doctor deleted successfully!');
          this.loadDoctors();
        },
        error: (error) => {
          this.notificationService.error('Failed to delete doctor. Please try again.');
        }
      });
    }
  }
}
