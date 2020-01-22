import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelompokPegawaiComponent } from './kelompok-pegawai.component';

describe('KelompokPegawaiComponent', () => {
  let component: KelompokPegawaiComponent;
  let fixture: ComponentFixture<KelompokPegawaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelompokPegawaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelompokPegawaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
