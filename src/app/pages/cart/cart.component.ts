import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  cartItems: any[] = [];

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.cdr.detectChanges();
    });
  }

  increaseQty(item: any) {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQty(item: any) {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: any) {
    this.cartService.removeFromCart(item.id);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  get total() {
    return this.cartService.getTotalAmount();
  }

  get itemCount() {
    return this.cartService.getCartCount();
  }
}
