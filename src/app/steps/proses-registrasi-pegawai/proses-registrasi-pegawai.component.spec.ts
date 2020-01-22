import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProsesRegistrasiPegawaiComponent } from './proses-registrasi-pegawai.component';

describe('ProsesRegistrasiPegawaiComponent', () => {
  let component: ProsesRegistrasiPegawaiComponent;
  let fixture: ComponentFixture<ProsesRegistrasiPegawaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProsesRegistrasiPegawaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProsesRegistrasiPegawaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
