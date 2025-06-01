// Core Angular imports
import { Component, OnInit } from '@angular/core';
import { EmployeeService, Employee } from '../../services/employee.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  // Local array to hold fetched employee records
  employees: Employee[] = [];

  // Injecting necessary services
  constructor(
    private employeeService: EmployeeService,   // Service to handle CRUD operations
    private router: Router,                     // Used for routing/navigation
    private notificationService: NotificationService, // To show success/error alerts
    private authService: AuthService            // Handles user authentication/logout
  ) {}

  // Lifecycle method called when component is initialized
  ngOnInit(): void {
    this.loadEmployees(); // Fetch employee data
  }

  // Loads all employees using the service
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data; // Bind response data to component
    });
  }

  // Navigates to the add employee form
  addEmployee(): void {
    this.router.navigate(['/employees/add']);
  }

  // Navigates to the edit employee form with specific ID
  editEmployee(id: number): void {
    this.router.navigate(['/employees/edit', id]);
  }

  // Deletes an employee after confirmation
  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.notificationService.success('Employee deleted successfully');
        this.loadEmployees(); // Refresh the list after deletion
      }, () => {
        this.notificationService.error('Failed to delete employee');
      });
    }
  }

  // Logs the user out by clearing token and navigating to login
  logout(): void {
    this.authService.logout(); // This typically clears token and redirects to /login
  }
}
