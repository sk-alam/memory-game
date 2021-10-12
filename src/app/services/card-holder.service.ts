import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {SERVER_URL} from '../app.constants';
import { catchError, map } from 'rxjs/operators';
import { Card } from '../card-face-model';

@Injectable({
  providedIn: 'root'
})
export class CardHolderService {

  /**
   * CardHolderService constructor
   * @param httpClient as HttpClint
   */
  constructor(private httpClient: HttpClient) { }

  /**
   * Receives requested card images with ids
   * @returns cards data observable
   */
  getCardFaces(): Observable<Card[]> {
    return this.httpClient.get<Card[]>(SERVER_URL).pipe(catchError(this.errorHandler));
  }

  /**
   * Error handler for http call
   * @param error HttpErrorResponse
   * @returns erros as observable
   */
  private errorHandler(error: HttpErrorResponse): Observable<Card[]> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something wrong. please try again later.');
  }
}
