import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RekapitulasiSkorAkhirKpiComponent } from './rekapitulasi-skor-akhir-kpi.component';

describe('RekapitulasiSkorAkhirKpiComponent', () => {
  let component: RekapitulasiSkorAkhirKpiComponent;
  let fixture: ComponentFixture<RekapitulasiSkorAkhirKpiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RekapitulasiSkorAkhirKpiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RekapitulasiSkorAkhirKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
