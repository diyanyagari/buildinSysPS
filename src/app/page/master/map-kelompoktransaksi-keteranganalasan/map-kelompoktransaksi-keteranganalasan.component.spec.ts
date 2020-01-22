import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapKelompoktransaksiKeteranganalasanComponent } from './map-kelompoktransaksi-keteranganalasan.component';

describe('MapKelompoktransaksiKeteranganalasanComponent', () => {
  let component: MapKelompoktransaksiKeteranganalasanComponent;
  let fixture: ComponentFixture<MapKelompoktransaksiKeteranganalasanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapKelompoktransaksiKeteranganalasanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapKelompoktransaksiKeteranganalasanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
