import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpApiComponent } from './http-api.component';

describe('HttpApiComponent', () => {
  let component: HttpApiComponent;
  let fixture: ComponentFixture<HttpApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HttpApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
