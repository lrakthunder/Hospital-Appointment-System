import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { NotificationComponent } from './components/notification/notification.component';
import { AdminDoctorsComponent } from './components/admin-doctors/admin-doctors.component';
import { DoctorLoginComponent } from './components/doctor-login/doctor-login.component';
import { DoctorDashboardComponent } from './components/doctor-dashboard/doctor-dashboard.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';
import { DoctorProfileComponent } from './components/doctor-profile/doctor-profile.component';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    UserDashboardComponent,
    AdminDashboardComponent,
    AppointmentBookingComponent,
    AppointmentHistoryComponent,
    FeedbackComponent,
    AdminAppointmentsComponent,
    AdminFeedbackComponent,
    AdminChartsComponent,
    AdminCalendarComponent,
    NotificationComponent,
    AdminDoctorsComponent,
    DoctorLoginComponent,
    DoctorDashboardComponent,
    PatientDetailsComponent,
    DoctorProfileComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEditorModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
