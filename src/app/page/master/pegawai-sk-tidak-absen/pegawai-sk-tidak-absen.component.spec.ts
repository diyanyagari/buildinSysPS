import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiSkTidakAbsenComponent } from './pegawai-sk-tidak-absen.component';

describe('PegawaiSkTidakAbsenComponent', () => {
  let component: PegawaiSkTidakAbsenComponent;
  let fixture: ComponentFixture<PegawaiSkTidakAbsenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiSkTidakAbsenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiSkTidakAbsenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
