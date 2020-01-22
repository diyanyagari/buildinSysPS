import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisOrganisasiComponent } from './jenis-organisasi.component';

describe('JenisOrganisasiComponent', () => {
  let component: JenisOrganisasiComponent;
  let fixture: ComponentFixture<JenisOrganisasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisOrganisasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisOrganisasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
