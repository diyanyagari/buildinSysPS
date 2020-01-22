import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KategoriPegawaiComponent } from './kategori-pegawai.component';

describe('KategoriPegawaiComponent', () => {
  let component: KategoriPegawaiComponent;
  let fixture: ComponentFixture<KategoriPegawaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KategoriPegawaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KategoriPegawaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
