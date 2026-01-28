import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';
  returnUrl: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn) {
      const userType = this.authService.userType;
      if (userType === 'doctor') {
        this.router.navigate(['/doctor/dashboard']);
      } else if (this.authService.isAdmin) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: (response) => {
          // Redirect based on user_type from response
          const userType = response.user_type || response.user.role;
          
          if (userType === 'admin') {
            this.router.navigate(['/admin']);
          } else if (userType === 'doctor') {
            this.router.navigate(['/doctor/dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.notificationService.error(error.error?.message || 'Login failed. Please check your credentials.');
          this.loading = false;
        }
      });
  }
}
