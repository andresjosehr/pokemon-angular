import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorStateService {

  public state = new BehaviorSubject<IHttpState>({} as IHttpState);

  constructor() { }
}

export interface IHttpState {
  url: string;
  state: HttpProgressState;
}

export enum HttpProgressState {
  start,
  end
}