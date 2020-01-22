import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeMasaKerjaReimbursComponent } from './ruangan.component';

describe('RangeMasaKerjaReimbursComponent', () => {
  let component: RangeMasaKerjaReimbursComponent;
  let fixture: ComponentFixture<RangeMasaKerjaReimbursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeMasaKerjaReimbursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeMasaKerjaReimbursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
