import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRuanganToKelasComponent } from './map-ruangan-to-kelas.component';

describe('mapRuanganToKelasComponent', () => {
  let component: MapRuanganToKelasComponent;
  let fixture: ComponentFixture<MapRuanganToKelasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapRuanganToKelasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRuanganToKelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
