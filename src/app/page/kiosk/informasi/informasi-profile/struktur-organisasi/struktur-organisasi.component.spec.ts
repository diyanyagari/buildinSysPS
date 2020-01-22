import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrukturOrganisasiComponent } from './struktur-organisasi.component';

describe('StrukturOrganisasiComponent', () => {
  let component: StrukturOrganisasiComponent;
  let fixture: ComponentFixture<StrukturOrganisasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrukturOrganisasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrukturOrganisasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
