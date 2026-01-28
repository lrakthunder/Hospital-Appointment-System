import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/dashboard-stats`);
  }

  getAllAppointments(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get(`${this.apiUrl}/admin/appointments`, { params });
  }

  updateAppointmentStatus(id: number, status: string, adminNotes?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/appointments/${id}/status`, {
      status,
      admin_notes: adminNotes
    });
  }

  getAllFeedback(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get(`${this.apiUrl}/admin/feedback`, { params });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users`);
  }

  getChartsData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/charts-data`);
  }

  getCalendarAppointments(startDate?: string, endDate?: string): Observable<any> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);
    return this.http.get(`${this.apiUrl}/admin/calendar-appointments`, { params });
  }
}
