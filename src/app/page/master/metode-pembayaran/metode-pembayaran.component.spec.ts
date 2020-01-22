import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodePembayaranComponent } from './metode-pembayaran.component';

describe('MetodePembayaranComponent', () => {
  let component: MetodePembayaranComponent;
  let fixture: ComponentFixture<MetodePembayaranComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetodePembayaranComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetodePembayaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
