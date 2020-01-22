import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapKelompokStatusToStatusComponent } from './map-kelompok-status-to-status.component';

describe('MapKelompokStatusToStatusComponent', () => {
  let component: MapKelompokStatusToStatusComponent;
  let fixture: ComponentFixture<MapKelompokStatusToStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapKelompokStatusToStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapKelompokStatusToStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
