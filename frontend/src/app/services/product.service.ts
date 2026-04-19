import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }
}
