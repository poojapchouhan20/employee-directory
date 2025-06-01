import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  // Bound to login form inputs
  username = '';
  password = '';

  // Used to show error message in the UI
  error = '';

  // Injecting AuthService and Router
  constructor(private authService: AuthService, private router: Router) {}

  // Called when the login form is submitted
  login() {
    // Call the login method in AuthService and subscribe to the result
    this.authService.login(this.username, this.password).subscribe({
      next: (res: any) => {
        // Log the full response from backend for debugging
        console.log('Full login response:', res);

        // Extract JWT token from the response (assumes it's named 'jwt')
        console.log('Token received:', res.jwt);
        const token = res.jwt;

        if (token) {
          // Save token to local storage for session persistence
          localStorage.setItem('token', token);
          console.log('Token saved in localStorage:', localStorage.getItem('token'));

          // Navigate to the employee list page upon successful login
          this.router.navigate(['/employees']);
        } else {
          // Handle case when token is not in the response
          console.error('Token not found in response');
          this.error = 'Login failed: token not received';
        }
      },
      error: (err) => {
        // Log error and show message to user
        console.error('Login error:', err);
        this.error = 'Invalid credentials';
      }
    });
  }
}
