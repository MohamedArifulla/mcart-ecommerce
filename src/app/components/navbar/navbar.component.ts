import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  cartService = inject(CartService);

  isLoggedIn$ = this.authService.isLoggedIn$;

  cartCount$ = this.cartService.cart$.pipe(
    map(items => items.reduce((sum, i) => sum + i.quantity, 0))
  );

  logout() {
    this.authService.logout();
  }
}
