import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  cartItems: any[] = [];
  loading = false;
  orderPlaced = false;
  errorMsg = '';

  address = {
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  };

  ngOnInit() {
    this.cartItems = this.cartService.getCart();
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  get total() {
    const raw = this.cartService.getTotalAmount();
    return raw > 1000 ? raw * 0.9 : raw;
  }

  get itemCount() {
    return this.cartService.getCartCount();
  }

  placeOrder() {
    if (!this.address.street || !this.address.city || !this.address.pincode || !this.address.phone) {
      this.errorMsg = 'Please fill all address fields';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const orderData = {
      items: this.cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: this.total,
      shippingAddress: this.address
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.orderPlaced = true;
        this.loading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/orders']), 3000);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Order failed. Try again!';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
