import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  specialization: string;
  license_number: string;
  years_of_experience: number;
  consultation_fee: number;
  available_days: string;
  available_time_start: string;
  available_time_end: string;
  bio?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  profile_photo?: string;
  qualifications?: string;
  education?: string;
  medical_school?: string;
  graduation_year?: number;
  certifications?: string;
  languages_spoken?: string;
  office_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  awards_recognition?: string;
  research_interests?: string;
  accepting_new_patients?: boolean;
  gender?: string;
  date_of_birth?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/doctors`;
  private adminApiUrl = `${environment.apiUrl}/admin/doctors`;

  constructor(private http: HttpClient) { }

  getAllDoctors(params?: any): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl, { params });
  }

  getDoctor(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  getDoctorsByDepartment(department: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/department/${department}`);
  }

  // Admin only
  createDoctor(doctor: any): Observable<any> {
    return this.http.post(this.adminApiUrl, doctor);
  }

  updateDoctor(id: number, doctor: any): Observable<any> {
    return this.http.put(`${this.adminApiUrl}/${id}`, doctor);
  }

  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.adminApiUrl}/${id}`);
  }

  // Doctor profile management
  getDoctorProfile(): Observable<Doctor> {
    return this.http.get<Doctor>(`${environment.apiUrl}/doctor/profile`);
  }

  updateDoctorProfile(profileData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/doctor/profile`, profileData);
  }

  // Admin get doctor profile
  getDoctorProfileById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.adminApiUrl}/${id}/profile`);
  }

  // Admin update doctor profile
  updateDoctorProfileByAdmin(id: number, profileData: any): Observable<any> {
    return this.http.put(`${this.adminApiUrl}/${id}/profile`, profileData);
  }
}
