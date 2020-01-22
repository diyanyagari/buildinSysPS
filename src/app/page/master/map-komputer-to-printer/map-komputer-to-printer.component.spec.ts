import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapKomputerToPrinterComponent } from './map-komputer-to-printer.component';

describe('MapKomputerToPrinterComponent', () => {
  let component: MapKomputerToPrinterComponent;
  let fixture: ComponentFixture<MapKomputerToPrinterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapKomputerToPrinterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapKomputerToPrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
