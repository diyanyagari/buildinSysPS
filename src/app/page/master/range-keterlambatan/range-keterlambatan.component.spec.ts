import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeKeterlambatanComponent } from './ruangan.component';

describe('RangeKeterlambatanComponent', () => {
  let component: RangeKeterlambatanComponent;
  let fixture: ComponentFixture<RangeKeterlambatanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeKeterlambatanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeKeterlambatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
