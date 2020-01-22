import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapGolonganAsuransiToKelasComponent } from './map-golongan-asuransi-to-kelas.component';

describe('MapGolonganAsuransiToKelasComponent', () => {
  let component: MapGolonganAsuransiToKelasComponent;
  let fixture: ComponentFixture<MapGolonganAsuransiToKelasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapGolonganAsuransiToKelasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapGolonganAsuransiToKelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
