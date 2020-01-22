import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPegawaiSkAsuransiComponent } from './master-pegawai-sk-asuransi.component';

describe('MasterPegawaiSkAsuransiComponent', () => {
  let component: MasterPegawaiSkAsuransiComponent;
  let fixture: ComponentFixture<MasterPegawaiSkAsuransiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPegawaiSkAsuransiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPegawaiSkAsuransiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
