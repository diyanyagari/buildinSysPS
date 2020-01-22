import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapKelompokUserGolonganPegawaiComponent } from './map-kelompok-user-golonganpegawai.component';

describe('MapKelompokUserGolonganPegawaiComponent', () => {
  let component: MapKelompokUserGolonganPegawaiComponent;
  let fixture: ComponentFixture<MapKelompokUserGolonganPegawaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapKelompokUserGolonganPegawaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapKelompokUserGolonganPegawaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
