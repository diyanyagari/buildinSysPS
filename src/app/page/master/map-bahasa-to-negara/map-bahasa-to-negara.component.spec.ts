import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapBahasaToNegaraComponent } from './map-bahasa-to-negara.component';

describe('MapBahasaToNegaraComponent', () => {
  let component: MapBahasaToNegaraComponent;
  let fixture: ComponentFixture<MapBahasaToNegaraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapBahasaToNegaraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapBahasaToNegaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
