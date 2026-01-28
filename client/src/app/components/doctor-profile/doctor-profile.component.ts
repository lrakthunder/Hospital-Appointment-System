import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService, Doctor } from '../../services/doctor.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit {
  doctor: Doctor | null = null;
  loading = true;
  isEditing = false;
  isOwnProfile = false;
  isAdmin = false;
  doctorId: number | null = null;

  profileForm: any = {};
  showPasswordChange = false;
  passwordForm = {
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
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
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    this.isAdmin = currentUser?.role === 'admin';

    // Check if viewing by ID (from admin) or own profile
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.doctorId = +params['id'];
        this.isOwnProfile = false;
        this.loadDoctorById(this.doctorId);
      } else {
        this.isOwnProfile = true;
        this.loadOwnProfile();
      }
    });
  }

  loadOwnProfile(): void {
    this.loading = true;
    this.doctorService.getDoctorProfile().subscribe({
      next: (doctor) => {
        this.doctor = doctor;
        this.initializeForm();
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Failed to load profile');
        this.loading = false;
      }
    });
  }

  loadDoctorById(id: number): void {
    this.loading = true;
    this.doctorService.getDoctorProfileById(id).subscribe({
      next: (doctor) => {
        this.doctor = doctor;
        this.initializeForm();
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Failed to load doctor profile');
        this.loading = false;
        this.router.navigate(['/admin/doctors']);
      }
    });
  }

  initializeForm(): void {
    if (!this.doctor) return;

    this.profileForm = {
      name: this.doctor.name || '',
      email: this.doctor.email || '',
      phone: this.doctor.phone || '',
      department: this.doctor.department || '',
      specialization: this.doctor.specialization || '',
      license_number: this.doctor.license_number || '',
      years_of_experience: this.doctor.years_of_experience || 0,
      consultation_fee: this.doctor.consultation_fee || 0,
      available_days: this.doctor.available_days || '',
      available_time_start: this.doctor.available_time_start?.substring(0, 5) || '09:00',
      available_time_end: this.doctor.available_time_end?.substring(0, 5) || '17:00',
      bio: this.doctor.bio || '',
      qualifications: this.doctor.qualifications || '',
      education: this.doctor.education || '',
      medical_school: this.doctor.medical_school || '',
      graduation_year: this.doctor.graduation_year || null,
      certifications: this.doctor.certifications || '',
      languages_spoken: this.doctor.languages_spoken || '',
      office_address: this.doctor.office_address || '',
      city: this.doctor.city || '',
      state: this.doctor.state || '',
      zip_code: this.doctor.zip_code || '',
      emergency_contact: this.doctor.emergency_contact || '',
      emergency_phone: this.doctor.emergency_phone || '',
      awards_recognition: this.doctor.awards_recognition || '',
      research_interests: this.doctor.research_interests || '',
      accepting_new_patients: this.doctor.accepting_new_patients !== false,
      gender: this.doctor.gender || '',
      date_of_birth: this.doctor.date_of_birth || '',
      status: this.doctor.status || 'active'
    };
  }

  toggleEdit(): void {
    if (this.isEditing) {
      // Cancel editing
      this.initializeForm();
    }
    this.isEditing = !this.isEditing;
    this.showPasswordChange = false;
  }

  saveProfile(): void {
    const dataToSave = { ...this.profileForm };

    // Add password change if requested
    if (this.showPasswordChange && this.isOwnProfile) {
      dataToSave.current_password = this.passwordForm.current_password;
      dataToSave.new_password = this.passwordForm.new_password;
      dataToSave.new_password_confirmation = this.passwordForm.new_password_confirmation;
    }

    const saveObservable = this.isOwnProfile || !this.isAdmin
      ? this.doctorService.updateDoctorProfile(dataToSave)
      : this.doctorService.updateDoctorProfileByAdmin(this.doctor!.id, dataToSave);

    saveObservable.subscribe({
      next: (response) => {
        this.notificationService.success('Profile updated successfully');
        this.doctor = response.doctor;
        this.isEditing = false;
        this.showPasswordChange = false;
        this.passwordForm = {
          current_password: '',
          new_password: '',
          new_password_confirmation: ''
        };
      },
      error: (error) => {
        if (error.error?.errors) {
          const errors = error.error.errors;
          const errorMessages = Object.values(errors).flat();
          this.notificationService.error(errorMessages.join(', '));
        } else {
          this.notificationService.error('Failed to update profile');
        }
      }
    });
  }

  goBack(): void {
    if (this.isAdmin && !this.isOwnProfile) {
      this.router.navigate(['/admin/doctors']);
    } else {
      this.router.navigate(['/doctor/dashboard']);
    }
  }
}
