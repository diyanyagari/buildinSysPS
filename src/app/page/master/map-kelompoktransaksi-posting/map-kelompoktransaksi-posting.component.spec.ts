import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapKelompoktransaksiPostingComponent } from './map-kelompoktransaksi-posting.component';

describe('MapKelompoktransaksiPostingComponent', () => {
  let component: MapKelompoktransaksiPostingComponent;
  let fixture: ComponentFixture<MapKelompoktransaksiPostingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapKelompoktransaksiPostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapKelompoktransaksiPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
