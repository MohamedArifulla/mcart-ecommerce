import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMsg = '';

  private authService = inject(AuthService);

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Please fill all fields';
      return;
    }
    this.loading = true;
    this.errorMsg = '';

    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = err.error?.message || 'Invalid credentials. Please try again.';
        }
      });
  }
}
