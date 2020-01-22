import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPegawaiSkFasilitasComponent } from './master-pegawai-sk-fasilitas.component';

describe('MasterPegawaiSkFasilitasComponent', () => {
  let component: MasterPegawaiSkFasilitasComponent;
  let fixture: ComponentFixture<MasterPegawaiSkFasilitasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPegawaiSkFasilitasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPegawaiSkFasilitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
