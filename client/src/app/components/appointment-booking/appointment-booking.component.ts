import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { DoctorService, Doctor } from '../../services/doctor.service';

@Component({
  selector: 'app-appointment-booking',
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.css']
})
export class AppointmentBookingComponent implements OnInit {
  appointmentForm!: FormGroup;
  loading = false;
  success = '';
  error = '';

  departments = [
    'General Medicine',
    'Cardiology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'ENT',
    'Ophthalmology',
    'Gynecology',
    'Neurology',
    'Psychiatry'
  ];

  allDoctors: Doctor[] = [];
  availableDoctors: Doctor[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    
    this.appointmentForm = this.formBuilder.group({
      patient_name: [user?.name || '', Validators.required],
      patient_email: [user?.email || '', [Validators.required, Validators.email]],
      patient_phone: [user?.phone || '', Validators.required],
      appointment_date: ['', Validators.required],
      appointment_time: ['', Validators.required],
      department: ['', Validators.required],
      doctor: [''],
      reason: ['']
    });

    // Load all active doctors
    this.loadDoctors();

    this.appointmentForm.get('department')?.valueChanges.subscribe(department => {
      this.filterDoctorsByDepartment(department);
    });
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors({ status: 'active' }).subscribe({
      next: (doctors) => {
        this.allDoctors = doctors;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.notificationService.error('Failed to load doctors');
      }
    });
  }

  filterDoctorsByDepartment(department: string): void {
    this.availableDoctors = this.allDoctors.filter(d => d.department === department);
    this.appointmentForm.patchValue({ doctor: '' });
  }

  get f() {
    return this.appointmentForm.controls;
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      return;
    }

    this.loading = true;

    this.appointmentService.createAppointment(this.appointmentForm.value).subscribe({
      next: (response) => {
        this.notificationService.success('Appointment booked successfully!');
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard/user']);
        }, 2000);
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Failed to book appointment. Please try again.');
        this.loading = false;
      }
    });
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
