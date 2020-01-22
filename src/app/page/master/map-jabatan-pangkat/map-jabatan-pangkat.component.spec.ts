import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapJabatanPangkatComponent } from './map-jabatan-pangkat.component';

describe('MapJabatanPangkatComponent', () => {
  let component: MapJabatanPangkatComponent;
  let fixture: ComponentFixture<MapJabatanPangkatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapJabatanPangkatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapJabatanPangkatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
