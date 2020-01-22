import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KualifikasiJurusanComponent } from './kualifikasi-jurusan.component';

describe('KualifikasiJurusanComponent', () => {
  let component: KualifikasiJurusanComponent;
  let fixture: ComponentFixture<KualifikasiJurusanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KualifikasiJurusanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KualifikasiJurusanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
