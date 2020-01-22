import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapFasilitasKelasComponent } from './map-fasilitas-kelas.component';

describe('MapFasilitasKelasComponent', () => {
  let component: MapFasilitasKelasComponent;
  let fixture: ComponentFixture<MapFasilitasKelasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapFasilitasKelasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapFasilitasKelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
