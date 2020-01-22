import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisPetugasPelaksanaComponent } from './jenis-petugas-pelaksana.component';

describe('JenisPetugasPelaksanaComponent', () => {
  let component: JenisPetugasPelaksanaComponent;
  let fixture: ComponentFixture<JenisPetugasPelaksanaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisPetugasPelaksanaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisPetugasPelaksanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
