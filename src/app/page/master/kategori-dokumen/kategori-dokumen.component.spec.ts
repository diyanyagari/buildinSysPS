import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KategoriDokumenComponent } from './kategori-dokumen.component';

describe('KategoriDokumenComponent', () => {
  let component: KategoriDokumenComponent;
  let fixture: ComponentFixture<KategoriDokumenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KategoriDokumenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KategoriDokumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
