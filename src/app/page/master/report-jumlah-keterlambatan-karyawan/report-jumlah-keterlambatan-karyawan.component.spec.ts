import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportJumlahKeterlambatanKaryawanComponent } from './report-jumlah-keterlambatan-karyawan.component';

describe('ReportJumlahKeterlambatanKaryawanComponent', () => {
  let component: ReportJumlahKeterlambatanKaryawanComponent;
  let fixture: ComponentFixture<ReportJumlahKeterlambatanKaryawanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportJumlahKeterlambatanKaryawanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportJumlahKeterlambatanKaryawanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
