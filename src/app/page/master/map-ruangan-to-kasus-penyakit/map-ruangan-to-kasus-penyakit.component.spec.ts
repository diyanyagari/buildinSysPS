import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRuanganToKasusPenyakitComponent } from './map-ruangan-to-kasus-penyakit.component';

describe('MapRuanganToKasusPenyakitComponent', () => {
  let component: MapRuanganToKasusPenyakitComponent;
  let fixture: ComponentFixture<MapRuanganToKasusPenyakitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapRuanganToKasusPenyakitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRuanganToKasusPenyakitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
