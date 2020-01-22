import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeMasaKerjaThrComponent } from './ruangan.component';

describe('RangeMasaKerjaThrComponent', () => {
  let component: RangeMasaKerjaThrComponent;
  let fixture: ComponentFixture<RangeMasaKerjaThrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeMasaKerjaThrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeMasaKerjaThrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
