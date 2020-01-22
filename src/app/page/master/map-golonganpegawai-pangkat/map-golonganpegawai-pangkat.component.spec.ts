import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapGolonganpegawaiPangkatComponent } from './map-golonganpegawai-pangkat.component';

describe('MapGolonganpegawaiPangkatComponent', () => {
  let component: MapGolonganpegawaiPangkatComponent;
  let fixture: ComponentFixture<MapGolonganpegawaiPangkatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapGolonganpegawaiPangkatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapGolonganpegawaiPangkatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
