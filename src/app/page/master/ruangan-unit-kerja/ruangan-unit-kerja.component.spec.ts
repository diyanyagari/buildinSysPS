import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuanganUnitKerjaComponent } from './ruangan-unit-kerja.component';

describe('RuanganUnitKerjaComponent', () => {
  let component: RuanganUnitKerjaComponent;
  let fixture: ComponentFixture<RuanganUnitKerjaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuanganUnitKerjaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuanganUnitKerjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
