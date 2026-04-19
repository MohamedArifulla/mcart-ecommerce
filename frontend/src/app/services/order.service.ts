import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, orderData);
  }

  createPaymentIntent(amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders/payment-intent`, { amount });
  }

  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`);
  }

  getOrderById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/orders/${id}`);
  }
}
