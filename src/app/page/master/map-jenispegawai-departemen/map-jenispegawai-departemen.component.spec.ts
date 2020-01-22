import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapJenispegawaiDepartemenComponent } from './map-jenispegawai-departemen.component';

describe('MapJenispegawaiDepartemenComponent', () => {
  let component: MapJenispegawaiDepartemenComponent;
  let fixture: ComponentFixture<MapJenispegawaiDepartemenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapJenispegawaiDepartemenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapJenispegawaiDepartemenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
