import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  orders: any[] = [];
  loading = true;
  errorMsg = '';

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMsg = 'Failed to load orders';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: any = {
      pending:    '#f59e0b',
      confirmed:  '#3b82f6',
      shipped:    '#8b5cf6',
      delivered:  '#22c55e',
      cancelled:  '#ef4444',
    };
    return colors[status?.toLowerCase()] || '#888';
  }

  getStatusIcon(status: string): string {
    const icons: any = {
      pending:   '⏳',
      confirmed: '✅',
      shipped:   '🚚',
      delivered: '📦',
      cancelled: '❌',
    };
    return icons[status?.toLowerCase()] || '📋';
  }
}
