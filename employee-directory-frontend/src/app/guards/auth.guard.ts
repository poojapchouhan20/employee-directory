import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'  // Makes this guard available application-wide
})
export class AuthGuard implements CanActivate {

  // Inject AuthService to check login status and Router to redirect
  constructor(private authService: AuthService, private router: Router) {}

  // This method is automatically called by Angular when a route with this guard is accessed
  canActivate(): boolean {
    // If the user is logged in, allow route activation
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      // Otherwise, redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}
