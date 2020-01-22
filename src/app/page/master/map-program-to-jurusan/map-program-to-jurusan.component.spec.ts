import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapProgramToJurusanComponent } from './map-program-to-jurusan.component';

describe('MapProgramToJurusanComponent', () => {
  let component: MapProgramToJurusanComponent;
  let fixture: ComponentFixture<MapProgramToJurusanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapProgramToJurusanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapProgramToJurusanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
