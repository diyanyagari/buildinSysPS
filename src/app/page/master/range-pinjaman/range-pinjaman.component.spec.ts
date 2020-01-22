import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangePinjamanComponent } from './ruangan.component';

describe('RangePinjamanComponent', () => {
  let component: RangePinjamanComponent;
  let fixture: ComponentFixture<RangePinjamanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangePinjamanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangePinjamanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
