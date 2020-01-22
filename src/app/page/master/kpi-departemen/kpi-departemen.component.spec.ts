import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiDepartemenComponent } from './kpi-departemen.component';

describe('KpiDepartemenComponent', () => {
  let component: KpiDepartemenComponent;
  let fixture: ComponentFixture<KpiDepartemenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiDepartemenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiDepartemenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
