import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

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
  paymentMethod: 'COD' | 'STRIPE' = 'COD';

  private stripe: Stripe | null = null;
  private cardElement: StripeCardElement | null = null;

  address = {
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  };

  async ngOnInit() {
    this.cartItems = this.cartService.getCart();
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }
    this.stripe = await loadStripe('pk_test_51TDv4jC0nd4rfuRNiNAIhlIvQAudw3Tim9Mv5C29NlSVbGfvDRMi54dPFxrtXxhjHzka3MzYGBp0jbXRL9ouA22l00atkIk9lZ');
  }

  get total() {
    const raw = this.cartService.getTotalAmount();
    return raw > 1000 ? raw * 0.9 : raw;
  }

  get itemCount() {
    return this.cartService.getCartCount();
  }

  onPaymentMethodChange() {
    if (this.paymentMethod === 'STRIPE') {
      setTimeout(() => this.mountStripeCard(), 100);
    } else {
      if (this.cardElement) {
        this.cardElement.destroy();
        this.cardElement = null;
      }
    }
  }

  mountStripeCard() {
    if (!this.stripe) return;
    const elements = this.stripe.elements();
    this.cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': { color: '#aab7c4' }
        }
      }
    });
    this.cardElement.mount('#card-element');
  }

  async placeOrder() {
    if (!this.address.street || !this.address.city || !this.address.pincode || !this.address.phone) {
      this.errorMsg = 'Please fill all address fields';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    if (this.paymentMethod === 'STRIPE') {
      await this.placeStripeOrder();
    } else {
      this.placeCODOrder();
    }
  }

  private async placeStripeOrder() {
    if (!this.stripe || !this.cardElement) {
      this.errorMsg = 'Stripe not loaded. Try again!';
      this.loading = false;
      return;
    }

    
    this.orderService.createPaymentIntent(this.total).subscribe({
      next: async (res: any) => {
        
        const { error, paymentIntent } = await this.stripe!.confirmCardPayment(
          res.clientSecret,
          { payment_method: { card: this.cardElement! } }
        );

        if (error) {
          this.errorMsg = error.message || 'Payment failed!';
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        
        const orderData = {
          items: this.cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: this.total,
          shippingAddress: this.address,
          paymentMethod: 'STRIPE'
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
            this.errorMsg = err.error?.message || 'Order failed!';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.errorMsg = 'Payment intent failed. Try again!';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private placeCODOrder() {
    const orderData = {
      items: this.cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: this.total,
      shippingAddress: this.address,
      paymentMethod: 'COD'
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
