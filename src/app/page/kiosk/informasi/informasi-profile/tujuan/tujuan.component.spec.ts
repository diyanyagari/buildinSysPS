import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TujuanComponent } from './tujuan.component';

describe('TujuanComponent', () => {
  let component: TujuanComponent;
  let fixture: ComponentFixture<TujuanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TujuanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TujuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
