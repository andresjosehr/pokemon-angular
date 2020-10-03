import { Component, OnInit } from '@angular/core';
import { HttpInterceptorService } from './services/http-interceptor/http-interceptor.service';
import { HttpInterceptorStateService } from './services/http-interceptor/http-interceptor-state.service';
import { startWith } from 'rxjs/operators';
import {Title} from "@angular/platform-browser";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'codigo-facilito-curso-angular';
  isLoading: boolean = false
  constructor(
    public httpStateService : HttpInterceptorStateService,
    private titleService    : Title
  ){
    this.titleService.setTitle("Pokemons");
  }

  ngOnInit(): void{
    this.httpStateService.state.pipe(startWith({state: 0})).subscribe(res => this.isLoading= res.state==1 ? false: true)
  }
}
