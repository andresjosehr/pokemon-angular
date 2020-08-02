import { TestBed } from '@angular/core/testing';

import { HttpInterceptorStateService } from './http-interceptor-state.service';

describe('HttpInterceptorStateService', () => {
  let service: HttpInterceptorStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpInterceptorStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
