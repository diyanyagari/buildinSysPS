import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeLiburHariOffLiburNasionalComponent } from './ruangan.component';

describe('RangeLiburHariOffLiburNasionalComponent', () => {
  let component: RangeLiburHariOffLiburNasionalComponent;
  let fixture: ComponentFixture<RangeLiburHariOffLiburNasionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeLiburHariOffLiburNasionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeLiburHariOffLiburNasionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
