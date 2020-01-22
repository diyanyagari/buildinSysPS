import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KomponenPenilaianKompetensiComponent } from './komponen.component';

describe('KomponenPenilaianKompetensiComponent', () => {
  let component: KomponenPenilaianKompetensiComponent;
  let fixture: ComponentFixture<KomponenPenilaianKompetensiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KomponenPenilaianKompetensiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KomponenPenilaianKompetensiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
