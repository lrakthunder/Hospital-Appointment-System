import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DoctorAppointment {
  id: number;
  user_id: number;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  department: string;
  doctor: string;
  reason: string;
  status: string;
  doctor_notes?: string;
  declined_reason?: string;
  created_at: string;
  attachments?: AppointmentAttachment[];
}

export interface AppointmentAttachment {
  id: number;
  appointment_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorAppointmentService {
  private apiUrl = `${environment.apiUrl}/doctor`;

  constructor(private http: HttpClient) { }

  getAppointments(params?: any): Observable<DoctorAppointment[]> {
    return this.http.get<DoctorAppointment[]>(`${this.apiUrl}/appointments`, { params });
  }

  getAppointment(id: number): Observable<DoctorAppointment> {
    return this.http.get<DoctorAppointment>(`${this.apiUrl}/appointments/${id}`);
  }

  updateStatus(id: number, status: string, notes?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/appointments/${id}/status`, {
      status,
      doctor_notes: notes
    });
  }

  declineAppointment(id: number, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/appointments/${id}/decline`, {
      declined_reason: reason
    });
  }

  addNotes(id: number, notes: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/appointments/${id}/notes`, {
      doctor_notes: notes
    });
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getPatientDetails(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient/${userId}`);
  }

  uploadAttachment(appointmentId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/appointments/${appointmentId}/attachments`, formData);
  }

  downloadAttachment(appointmentId: number, attachmentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/appointments/${appointmentId}/attachments/${attachmentId}`, {
      responseType: 'blob'
    });
  }

  deleteAttachment(appointmentId: number, attachmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/appointments/${appointmentId}/attachments/${attachmentId}`);
  }
}
