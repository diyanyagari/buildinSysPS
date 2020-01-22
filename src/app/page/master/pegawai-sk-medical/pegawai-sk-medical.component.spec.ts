import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiSkMedicalComponent } from './pegawai-sk-medical.component';

describe('PegawaiSkMedicalComponent', () => {
  let component: PegawaiSkMedicalComponent;
  let fixture: ComponentFixture<PegawaiSkMedicalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiSkMedicalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiSkMedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
