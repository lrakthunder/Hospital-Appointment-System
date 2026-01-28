import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorAuthService } from '../../services/doctor-auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-doctor-login',
  templateUrl: './doctor-login.component.html',
  styleUrls: ['./doctor-login.component.css']
})
export class DoctorLoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private doctorAuthService: DoctorAuthService,
    private notificationService: NotificationService
  ) {
    if (this.doctorAuthService.isLoggedIn) {
      this.router.navigate(['/doctor/dashboard']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.doctorAuthService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: (response) => {
          this.notificationService.success('Welcome, Dr. ' + response.doctor.name);
          this.router.navigate(['/doctor/dashboard']);
        },
        error: (error) => {
          this.notificationService.error(error.error?.message || 'Login failed. Please check your credentials.');
          this.loading = false;
        }
      });
  }
}
