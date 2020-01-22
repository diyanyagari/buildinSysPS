import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeMasaKerjaPensiunComponent } from './ruangan.component';

describe('RangeMasaKerjaPensiunComponent', () => {
  let component: RangeMasaKerjaPensiunComponent;
  let fixture: ComponentFixture<RangeMasaKerjaPensiunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeMasaKerjaPensiunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeMasaKerjaPensiunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
