import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisRangeComponent } from './jenis-range.component';

describe('JenisRangeComponent', () => {
  let component: JenisRangeComponent;
  let fixture: ComponentFixture<JenisRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
