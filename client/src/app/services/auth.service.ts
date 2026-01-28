import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
  user_type?: string; // 'user', 'admin', or 'doctor'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  public get isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  public get isDoctor(): boolean {
    const userType = localStorage.getItem('user_type');
    return userType === 'doctor';
  }

  public get userType(): string | null {
    return localStorage.getItem('user_type');
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          if (response.user_type) {
            localStorage.setItem('user_type', response.user_type);
          }
          this.currentUserSubject.next(response.user);
        })
      );
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
