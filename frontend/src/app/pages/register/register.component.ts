import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = false;
  errorMsg = '';
  successMsg = '';

  private authService = inject(AuthService);

  onSubmit() {
    if (!this.name || !this.email || !this.password) {
      this.errorMsg = 'Please fill all fields';
      return;
    }
    if (this.password.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.authService.register({ name: this.name, email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.loading = false;
          // Auto redirect to products (AuthService handles it)
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = err.error?.message || 'Registration failed';
        }
      });
  }
}
