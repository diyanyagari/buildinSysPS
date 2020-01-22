import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelompokTransaksiDetailComponent } from './kelompok-transaksi-detail.component';

describe('KelompokTransaksiDetailComponent', () => {
  let component: KelompokTransaksiDetailComponent;
  let fixture: ComponentFixture<KelompokTransaksiDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelompokTransaksiDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelompokTransaksiDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
