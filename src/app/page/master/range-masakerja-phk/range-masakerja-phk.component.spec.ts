import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeMasaKerjaPhkComponent } from './ruangan.component';

describe('RangeMasaKerjaPhkComponent', () => {
  let component: RangeMasaKerjaPhkComponent;
  let fixture: ComponentFixture<RangeMasaKerjaPhkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeMasaKerjaPhkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeMasaKerjaPhkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
