import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapKelompokUserJabatanComponent } from './map-kelompok-user-jabatan.component';

describe('MapKelompokUserJabatanComponent', () => {
  let component: MapKelompokUserJabatanComponent;
  let fixture: ComponentFixture<MapKelompokUserJabatanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapKelompokUserJabatanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapKelompokUserJabatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
