import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiSkStatusCutiNewComponent } from './pegawai-sk-status-cuti-new.component';

describe('PegawaiSkStatusCutiNewComponent', () => {
  let component: PegawaiSkStatusCutiNewComponent;
  let fixture: ComponentFixture<PegawaiSkStatusCutiNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiSkStatusCutiNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiSkStatusCutiNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
