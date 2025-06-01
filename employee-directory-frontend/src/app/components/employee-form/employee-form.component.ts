// Angular core modules and services
import { Component, OnInit } from '@angular/core';
import { EmployeeService, Employee } from '../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { CanComponentDeactivate } from '../../guards/pending-changes.guard';

// Component metadata: selector, HTML template, and CSS
@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit, CanComponentDeactivate {
  employeeForm!: FormGroup;       // Reactive form instance
  employeeId?: number;            // Holds the employee ID (for edit)
  isEditMode = false;             // Flag to differentiate add vs edit
  private formSubmitted = false;  // Tracks if form was submitted (used in guard)

  // Injecting required services
  constructor(
    private fb: FormBuilder,                     // FormBuilder to construct the form
    private employeeService: EmployeeService,    // Handles API calls
    private router: Router,                      // For navigation
    private route: ActivatedRoute,               // To access route params
    private notificationService: NotificationService // For success/error messages
  ) {}

  // Lifecycle hook - runs once component is initialized
  ngOnInit(): void {
    // Get the ID from the route to check if it's edit mode
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.employeeId;

    // Initialize the form with validation rules
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    // If editing, prefill form with employee data from backend
    if (this.isEditMode) {
      this.employeeService.getEmployee(this.employeeId!).subscribe(employee => {
        this.employeeForm.patchValue(employee);
      });
    }
  }

  // Called when form is submitted
  onSubmit() {
    if (this.employeeForm.invalid) {
      return; // Prevent submission if form is invalid
    }

    // Prepare employee object for submission
    const employee: Employee = this.isEditMode
      ? { id: this.employeeId!, ...this.employeeForm.value }
      : { ...this.employeeForm.value };

    if (this.isEditMode) {
      // Update existing employee
      this.employeeService.updateEmployee(this.employeeId!, employee).subscribe(() => {
        this.notificationService.success('Employee updated successfully');
        this.formSubmitted = true;
        this.router.navigate(['/employees']);
      }, () => {
        this.notificationService.error('Failed to update employee');
      });
    } else {
      // Add new employee
      this.employeeService.addEmployee(employee).subscribe(() => {
        this.notificationService.success('Employee added successfully');
        this.formSubmitted = true;
        this.employeeForm.reset();
        this.router.navigate(['/employees']);
      }, () => {
        this.notificationService.error('Failed to add employee');
      });
    }
  }

  // Called when the user clicks Cancel
  onCancel() {
    this.router.navigate(['/employees']); // Navigate back to employee list
  }

  // Guard to prevent navigation with unsaved changes
  canDeactivate(): boolean {
    if (this.employeeForm.dirty && !this.formSubmitted) {
      return confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }

  // Convenience getters for form fields (used in template for validation)
  get firstName() {
    return this.employeeForm.get('firstName');
  }

  get lastName() {
    return this.employeeForm.get('lastName');
  }

  get email() {
    return this.employeeForm.get('email');
  }
}
