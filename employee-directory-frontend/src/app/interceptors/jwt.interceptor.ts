import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';  // adjust the path if needed

/**
 * JwtInterceptor intercepts all outgoing HTTP requests
 * and adds the JWT token to the Authorization header if available.
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  /**
   * Intercepts HTTP requests and adds the Authorization header with a Bearer token.
   * 
   * @param request The outgoing HTTP request
   * @param next The next interceptor in the chain or the backend
   * @returns An Observable of the HTTP event stream
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the JWT token from the authentication service
    const token = this.authService.getToken();

    if (token) {
      // Clone the request to add the new header, as HttpRequest is immutable
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`  // Add JWT token in the Authorization header
        }
      });
    }

    // Pass the (possibly modified) request to the next handler
    return next.handle(request);
  }
}
