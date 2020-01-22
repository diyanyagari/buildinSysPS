import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliRawatJalanComponent } from './poli-rawat-jalan.component';

describe('PoliRawatJalanComponent', () => {
  let component: PoliRawatJalanComponent;
  let fixture: ComponentFixture<PoliRawatJalanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoliRawatJalanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliRawatJalanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
