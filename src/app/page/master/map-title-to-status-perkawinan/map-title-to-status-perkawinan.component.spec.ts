import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTitleToStatusPerkawinanComponent } from './map-title-to-status-perkawinan.component';

describe('MapTitleToStatusPerkawinanComponent', () => {
  let component: MapTitleToStatusPerkawinanComponent;
  let fixture: ComponentFixture<MapTitleToStatusPerkawinanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTitleToStatusPerkawinanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTitleToStatusPerkawinanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
