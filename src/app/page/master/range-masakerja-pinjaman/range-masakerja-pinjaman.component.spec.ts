import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeMasaKerjaPinjamanComponent } from './ruangan.component';

describe('RangeMasaKerjaPinjamanComponent', () => {
  let component: RangeMasaKerjaPinjamanComponent;
  let fixture: ComponentFixture<RangeMasaKerjaPinjamanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeMasaKerjaPinjamanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeMasaKerjaPinjamanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
