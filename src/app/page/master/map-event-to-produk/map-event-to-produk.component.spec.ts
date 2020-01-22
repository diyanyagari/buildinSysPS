import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapEventToProdukComponent } from './map-event-to-produk.component';

describe('MapEventToProdukComponent', () => {
  let component: MapEventToProdukComponent;
  let fixture: ComponentFixture<MapEventToProdukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapEventToProdukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapEventToProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
