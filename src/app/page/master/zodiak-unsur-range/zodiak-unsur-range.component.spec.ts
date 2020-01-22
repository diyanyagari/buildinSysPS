import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZodiakUnsurRangeComponent } from './zodiak-unsur-range.component';

describe('ZodiakUnsurRangeComponent', () => {
  let component: ZodiakUnsurRangeComponent;
  let fixture: ComponentFixture<ZodiakUnsurRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZodiakUnsurRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZodiakUnsurRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
