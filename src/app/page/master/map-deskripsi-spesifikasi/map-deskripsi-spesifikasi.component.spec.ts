import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDeskripsiSepsifikasiComponent } from './map-deskripsi-sepsifikasi.component';

describe('MapDeskripsiSepsifikasiComponent', () => {
  let component: MapDeskripsiSepsifikasiComponent;
  let fixture: ComponentFixture<MapDeskripsiSepsifikasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapDeskripsiSepsifikasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapDeskripsiSepsifikasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
