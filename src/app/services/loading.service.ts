import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  /**
   * Loading service sonstructor
   */

  constructor() { }

  /**
   * Loading observable
   */
  loading$ = new BehaviorSubject(false);

  /**
   * Set loading
   */
  setLoading(): void {
    this.loading$.next(true);
  }

  /**
   * Reset loading
   */
  resetLoading(): void {
    this.loading$.next(false);
  }

}
