import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapObjekModulToKelompokUserComponent } from './map-objek-modul-to-kelompok-user.component';

describe('MapObjekModulToKelompokUserComponent', () => {
  let component: MapObjekModulToKelompokUserComponent;
  let fixture: ComponentFixture<MapObjekModulToKelompokUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapObjekModulToKelompokUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapObjekModulToKelompokUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
