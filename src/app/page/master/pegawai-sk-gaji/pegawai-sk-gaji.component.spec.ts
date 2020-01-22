import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiSkGajiComponent } from './pegawai-sk-gaji.component';

describe('PegawaiSkGajiComponent', () => {
  let component: PegawaiSkGajiComponent;
  let fixture: ComponentFixture<PegawaiSkGajiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiSkGajiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiSkGajiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
