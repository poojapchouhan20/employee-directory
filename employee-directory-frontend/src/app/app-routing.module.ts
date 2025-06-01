import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { PendingChangesGuard } from './guards/pending-changes.guard';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // Redirect empty path to the login page
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Login route accessible by all users
  { path: 'login', component: LoginComponent },

  // Employee list page - protected by AuthGuard to allow only authenticated users
  { 
    path: 'employees', 
    component: EmployeeListComponent, 
    canActivate: [AuthGuard] 
  },

  // Route to add a new employee
  // Protected by AuthGuard (only authenticated users)
  // Uses PendingChangesGuard to warn if there are unsaved changes when navigating away
  { 
    path: 'employees/add', 
    component: EmployeeFormComponent, 
    canActivate: [AuthGuard],
    canDeactivate: [PendingChangesGuard]
  },

  // Route to edit an existing employee by id
  // Also protected by AuthGuard and guarded by PendingChangesGuard
  { 
    path: 'employees/edit/:id', 
    component: EmployeeFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [PendingChangesGuard]
  },

  // Wildcard route for any unknown paths, redirects to login page
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Configures the router at the application's root level
  exports: [RouterModule]  // Makes router directives available throughout the app
})
export class AppRoutingModule { }
