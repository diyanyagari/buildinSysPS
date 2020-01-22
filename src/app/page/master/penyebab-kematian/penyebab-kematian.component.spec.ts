import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenyebabKematianComponent } from './penyebab-kematian.component';

describe('PenyebabKematianComponent', () => {
  let component: PenyebabKematianComponent;
  let fixture: ComponentFixture<PenyebabKematianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenyebabKematianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenyebabKematianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
