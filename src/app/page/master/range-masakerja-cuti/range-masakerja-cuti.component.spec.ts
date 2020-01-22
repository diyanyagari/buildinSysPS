import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeMasaKerjaCutiComponent } from './ruangan.component';

describe('RangeMasaKerjaCutiComponent', () => {
  let component: RangeMasaKerjaCutiComponent;
  let fixture: ComponentFixture<RangeMasaKerjaCutiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeMasaKerjaCutiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeMasaKerjaCutiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
