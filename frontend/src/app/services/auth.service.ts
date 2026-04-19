import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = environment.apiUrl;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  register(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data).pipe(
      tap((res: any) => {
        this.saveToken(res.access_token);
        this.router.navigate(['/products']);
      })
    );
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data).pipe(
      tap((res: any) => {
        this.saveToken(res.access_token);
        this.router.navigate(['/products']);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  private saveToken(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedInSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
