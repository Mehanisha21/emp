import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  showPassword: boolean = false;

  private loginUrl = 'http://localhost:3000/api/employee-login';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: NgForm) {
    this.errorMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Please fill in both username and password.';
      return;
    }

    this.loading = true;

    this.http.post<any>(this.loginUrl, { persno: this.username, password: this.password })
      .subscribe({
        next: response => {
          this.loading = false;
          if (response && response.status === 'Success') {
            // Save persno to auth service
            this.authService.setPersno(this.username);
            // Redirect on successful login to dashboard page
            this.router.navigate(['/dashboard']);
          } else {
            // Fallback message
            this.errorMessage = response.message || 'Login failed. Try again.';
          }
        },
        error: err => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Server error. Please try again later.';
        }
      });
  }
}
