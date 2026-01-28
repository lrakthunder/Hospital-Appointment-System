import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Feedback {
  id?: number;
  user_id?: number;
  appointment_id?: number;
  rating: number;
  comment?: string;
  department?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getFeedback(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/feedback`);
  }

  getMyFeedback(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/my-feedback`);
  }

  createFeedback(feedback: Feedback): Observable<any> {
    return this.http.post(`${this.apiUrl}/feedback`, feedback);
  }

  updateFeedback(id: number, feedback: Partial<Feedback>): Observable<any> {
    return this.http.put(`${this.apiUrl}/feedback/${id}`, feedback);
  }

  deleteFeedback(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/feedback/${id}`);
  }
}
