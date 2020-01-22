import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisAlamatComponent } from './jenis-alamat.component';

describe('JenisAlamatComponent', () => {
  let component: JenisAlamatComponent;
  let fixture: ComponentFixture<JenisAlamatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisAlamatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisAlamatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
