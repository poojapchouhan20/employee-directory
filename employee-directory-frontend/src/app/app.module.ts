import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';  // Application routing configuration
import { AppComponent } from './app.component';           // Root component
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';  // HTTP Client & interceptors
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Template-driven and reactive forms
import { ToastrModule } from 'ngx-toastr';  // Toast notifications
import { LoginComponent } from './components/login/login.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor'; // JWT interceptor for auth token

@NgModule({
  declarations: [
    AppComponent,           // Declare the root app component
    EmployeeListComponent,  // Declare employee list UI component
    EmployeeFormComponent,  // Declare employee form UI component
    LoginComponent          // Declare login component
  ],
  imports: [
    FormsModule,            // Import template-driven forms module
    BrowserModule,          // Required for browser apps
    ReactiveFormsModule,    // Import reactive forms module
    AppRoutingModule,       // Import app routing configuration
    HttpClientModule,       // Import HTTP client module for API calls
    ToastrModule.forRoot({  // Configure toast notifications globally
      timeOut: 1000,        // Toasts disappear after 1 second
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,  // Add JwtInterceptor to the chain of HTTP interceptors
      multi: true                // Allow multiple interceptors if needed
    }
  ],
  bootstrap: [AppComponent]  // Bootstrap the root component to launch the app
})
export class AppModule { }
