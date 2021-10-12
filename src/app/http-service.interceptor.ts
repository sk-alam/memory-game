import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingService } from './services/loading.service';
import { finalize } from 'rxjs/operators';

/**
 *  Set loading flag before each http call start and reset loading flag after complete http call
 */
@Injectable()
export class HttpServiceInterceptor implements HttpInterceptor {

  /**
   * Interceptor service
   * @param laodingService - loading service
   */
  constructor(private laodingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Set laoding before each http call
    this.laodingService.setLoading();

    return next.handle(request).pipe(
      // after each http call complete reset loading
      finalize(() => this.laodingService.resetLoading()));
  }
}
