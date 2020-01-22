import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapKelompoktransaksiStrukturnomorComponent } from './map-kelompoktransaksi-strukturnomor.component';

describe('MapKelompoktransaksiStrukturnomorComponent', () => {
  let component: MapKelompoktransaksiStrukturnomorComponent;
  let fixture: ComponentFixture<MapKelompoktransaksiStrukturnomorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapKelompoktransaksiStrukturnomorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapKelompoktransaksiStrukturnomorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
