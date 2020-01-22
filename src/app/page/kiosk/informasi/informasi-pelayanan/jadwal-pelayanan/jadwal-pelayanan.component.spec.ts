import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JadwalPelayananComponent } from './jadwal-pelayanan.component';

describe('JadwalPelayananComponent', () => {
  let component: JadwalPelayananComponent;
  let fixture: ComponentFixture<JadwalPelayananComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JadwalPelayananComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JadwalPelayananComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
