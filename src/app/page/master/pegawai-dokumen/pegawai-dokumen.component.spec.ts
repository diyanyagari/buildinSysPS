import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiDokumenComponent } from './pegawai-dokumen.component';

describe('PegawaiDokumenComponent', () => {
  let component: PegawaiDokumenComponent;
  let fixture: ComponentFixture<PegawaiDokumenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiDokumenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiDokumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
