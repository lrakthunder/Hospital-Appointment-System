import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AppointmentBookingComponent } from './components/appointment-booking/appointment-booking.component';
import { AppointmentHistoryComponent } from './components/appointment-history/appointment-history.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { AdminAppointmentsComponent } from './components/admin-appointments/admin-appointments.component';
import { AdminFeedbackComponent } from './components/admin-feedback/admin-feedback.component';
import { AdminChartsComponent } from './components/admin-charts/admin-charts.component';
import { AdminCalendarComponent } from './components/admin-calendar/admin-calendar.component';
import { AdminDoctorsComponent } from './components/admin-doctors/admin-doctors.component';
import { DoctorLoginComponent } from './components/doctor-login/doctor-login.component';
import { DoctorDashboardComponent } from './components/doctor-dashboard/doctor-dashboard.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';
import { DoctorProfileComponent } from './components/doctor-profile/doctor-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { DoctorGuard } from './guards/doctor.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: 'user', component: UserDashboardComponent },
      { path: 'book-appointment', component: AppointmentBookingComponent },
      { path: 'appointment-history', component: AppointmentHistoryComponent },
      { path: 'feedback', component: FeedbackComponent },
    ]
  },
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'appointments', component: AdminAppointmentsComponent },
      { path: 'feedback', component: AdminFeedbackComponent },
      { path: 'charts', component: AdminChartsComponent },
      { path: 'calendar', component: AdminCalendarComponent },
      { path: 'doctors', component: AdminDoctorsComponent },
      { path: 'doctors/:id/profile', component: DoctorProfileComponent },
    ]
  },
  {
    path: 'doctor',
    children: [
      { path: 'login', component: DoctorLoginComponent },
      { path: 'dashboard', component: DoctorDashboardComponent, canActivate: [DoctorGuard] },
      { path: 'profile', component: DoctorProfileComponent, canActivate: [DoctorGuard] },
      { path: 'patient/:id', component: PatientDetailsComponent, canActivate: [DoctorGuard] },
    ]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
