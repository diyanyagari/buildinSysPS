import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapAngkaToHariComponent } from './map-angka-to-hari.component';

describe('MapAngkaToHariComponent', () => {
  let component: MapAngkaToHariComponent;
  let fixture: ComponentFixture<MapAngkaToHariComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapAngkaToHariComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapAngkaToHariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
