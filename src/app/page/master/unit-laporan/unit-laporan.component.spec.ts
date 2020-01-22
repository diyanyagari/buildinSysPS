import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitLaporanComponent } from './unit-laporan.component';

describe('UnitLaporanComponent', () => {
  let component: UnitLaporanComponent;
  let fixture: ComponentFixture<UnitLaporanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitLaporanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitLaporanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
