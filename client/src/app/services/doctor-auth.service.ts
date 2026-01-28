import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  status: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorAuthService {
  private currentDoctorSubject: BehaviorSubject<Doctor | null>;
  public currentDoctor: Observable<Doctor | null>;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    const storedDoctor = localStorage.getItem('currentDoctor');
    this.currentDoctorSubject = new BehaviorSubject<Doctor | null>(
      storedDoctor ? JSON.parse(storedDoctor) : null
    );
    this.currentDoctor = this.currentDoctorSubject.asObservable();
  }

  public get currentDoctorValue(): Doctor | null {
    return this.currentDoctorSubject.value;
  }

  public get isLoggedIn(): boolean {
    return !!this.currentDoctorValue && !!localStorage.getItem('doctorToken');
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/doctor/login`, { email, password })
      .pipe(map(response => {
        localStorage.setItem('currentDoctor', JSON.stringify(response.doctor));
        localStorage.setItem('doctorToken', response.token);
        this.currentDoctorSubject.next(response.doctor);
        return response;
      }));
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctor/logout`, {})
      .pipe(map(() => {
        localStorage.removeItem('currentDoctor');
        localStorage.removeItem('doctorToken');
        this.currentDoctorSubject.next(null);
      }));
  }

  getMe(): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/doctor/me`);
  }
}
