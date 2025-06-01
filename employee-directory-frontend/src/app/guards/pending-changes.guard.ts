import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Interface to be implemented by components
 * that want to control whether they can be deactivated.
 * The method can return a boolean or an Observable<boolean>
 * indicating if the component can be left.
 */
export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root', // This makes the guard available application-wide
})
export class PendingChangesGuard implements CanDeactivate<CanComponentDeactivate> {

  /**
   * Method called by Angular's router to check if the route
   * can be deactivated (i.e., navigate away from the current component).
   * Delegates the check to the component's `canDeactivate` method if it exists,
   * otherwise returns true to allow navigation by default.
   * 
   * @param component The current component implementing CanComponentDeactivate
   * @returns boolean or Observable<boolean> indicating if navigation is allowed
   */
  canDeactivate(component: CanComponentDeactivate): boolean | Observable<boolean> {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
