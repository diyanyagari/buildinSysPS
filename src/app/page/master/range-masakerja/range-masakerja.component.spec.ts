import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeMasaKerjaComponent } from './ruangan.component';

describe('RangeMasaKerjaComponent', () => {
  let component: RangeMasaKerjaComponent;
  let fixture: ComponentFixture<RangeMasaKerjaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeMasaKerjaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeMasaKerjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
