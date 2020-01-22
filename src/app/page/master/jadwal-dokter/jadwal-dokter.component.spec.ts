import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JadwalDokterComponent } from './jadwal-dokter.component';

describe('JadwalDokterComponent', () => {
  let component: JadwalDokterComponent;
  let fixture: ComponentFixture<JadwalDokterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JadwalDokterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JadwalDokterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
