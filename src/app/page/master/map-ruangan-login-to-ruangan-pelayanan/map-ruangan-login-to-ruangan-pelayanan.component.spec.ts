import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRuanganLoginToRuanganPelayananComponent } from './map-ruangan-login-to-ruangan-pelayanan.component';

describe('MapRuanganLoginToRuanganPelayananComponent', () => {
  let component: MapRuanganLoginToRuanganPelayananComponent;
  let fixture: ComponentFixture<MapRuanganLoginToRuanganPelayananComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapRuanganLoginToRuanganPelayananComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRuanganLoginToRuanganPelayananComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
