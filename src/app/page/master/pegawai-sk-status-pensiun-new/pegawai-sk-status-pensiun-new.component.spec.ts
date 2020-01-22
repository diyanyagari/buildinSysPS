import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiSkStatusPensiunNewComponent } from './pegawai-sk-status-pensiun-new.component';

describe('PegawaiSkStatusPensiunNewComponent', () => {
  let component: PegawaiSkStatusPensiunNewComponent;
  let fixture: ComponentFixture<PegawaiSkStatusPensiunNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiSkStatusPensiunNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiSkStatusPensiunNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
