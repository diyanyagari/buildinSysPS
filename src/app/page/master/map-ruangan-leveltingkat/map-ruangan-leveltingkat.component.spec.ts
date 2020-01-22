import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRuanganLeveltingkatComponent } from './map-ruangan-leveltingkat.component';

describe('MapRuanganLeveltingkatComponent', () => {
  let component: MapRuanganLeveltingkatComponent;
  let fixture: ComponentFixture<MapRuanganLeveltingkatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapRuanganLeveltingkatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRuanganLeveltingkatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
