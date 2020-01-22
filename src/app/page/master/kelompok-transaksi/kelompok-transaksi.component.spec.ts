import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelompokTransaksiComponent } from './kelompok-transaksi.component';

describe('KelompokTransaksiComponent', () => {
  let component: KelompokTransaksiComponent;
  let fixture: ComponentFixture<KelompokTransaksiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelompokTransaksiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelompokTransaksiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
