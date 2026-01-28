import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Appointment {
  id?: number;
  user_id?: number;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  department: string;
  doctor?: string;
  doctor_name?: string;
  reason?: string;
  status?: string;
  admin_notes?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments`);
  }

  getMyAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/my-appointments`);
  }

  getAppointmentHistory(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointment-history`);
  }

  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/appointments/${id}`);
  }

  createAppointment(appointment: Appointment): Observable<any> {
    return this.http.post(`${this.apiUrl}/appointments`, appointment);
  }

  updateAppointment(id: number, appointment: Partial<Appointment>): Observable<any> {
    return this.http.put(`${this.apiUrl}/appointments/${id}`, appointment);
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/appointments/${id}`);
  }
}
