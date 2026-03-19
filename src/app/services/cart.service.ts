import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartKey = 'mcart_cart';
  private cartSubject = new BehaviorSubject<any[]>(this.getCart());
  cart$ = this.cartSubject.asObservable();

  getCart(): any[] {
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
  }

  addToCart(product: any, quantity = 1) {
    const cart = this.getCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    this.saveCart(cart);
  }

  removeFromCart(productId: string) {
    const cart = this.getCart().filter(i => i.id !== productId);
    this.saveCart(cart);
  }

  updateQuantity(productId: string, quantity: number) {
    const cart = this.getCart().map(i =>
      i.id === productId ? { ...i, quantity } : i
    );
    this.saveCart(cart);
  }

  clearCart() {
    this.saveCart([]);
  }

  getCartCount(): number {
    return this.getCart().reduce((sum, i) => sum + i.quantity, 0);
  }

  getTotalAmount(): number {
    return this.getCart().reduce((sum, i) => sum + (i.price * i.quantity), 0);
  }

  private saveCart(cart: any[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }
}
