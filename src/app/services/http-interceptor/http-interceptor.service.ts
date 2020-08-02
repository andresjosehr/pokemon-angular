import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { retryWhen, take, delay, finalize, tap } from 'rxjs/operators';
import { HttpInterceptorStateService, HttpProgressState } from './http-interceptor-state.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService {

  private exceptions: string[] = ['login']

  constructor(
    public httpStateService: HttpInterceptorStateService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.httpStateService.state.next({
      url: request.url,
      state: HttpProgressState.start
    });
    
    return next.handle(request).pipe(
      finalize(() => {
      this.httpStateService.state.next({
        url: request.url,
        state: HttpProgressState.end
      });
    }));

  }
  
}

