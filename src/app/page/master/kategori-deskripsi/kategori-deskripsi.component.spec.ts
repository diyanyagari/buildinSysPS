import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KategoriDeskripsiComponent } from './kategori-deskripsi.component';

describe('KategoriDeskripsiComponent', () => {
  let component: KategoriDeskripsiComponent;
  let fixture: ComponentFixture<KategoriDeskripsiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KategoriDeskripsiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KategoriDeskripsiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
