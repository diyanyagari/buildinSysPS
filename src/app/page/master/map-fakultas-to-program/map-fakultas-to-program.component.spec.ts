import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapFakultasToProgramComponent } from './map-fakultas-to-program.component';

describe('MapFakultasToProgramComponent', () => {
  let component: MapFakultasToProgramComponent;
  let fixture: ComponentFixture<MapFakultasToProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapFakultasToProgramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapFakultasToProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
