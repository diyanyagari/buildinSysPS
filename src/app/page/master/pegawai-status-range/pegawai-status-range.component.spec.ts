import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiStatusRangeComponent } from './pegawai-status-range.component';

describe('PegawaiStatusRangeComponent', () => {
  let component: PegawaiStatusRangeComponent;
  let fixture: ComponentFixture<PegawaiStatusRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiStatusRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiStatusRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
