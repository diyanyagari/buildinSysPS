import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KategoriAsetComponent } from './kategori-aset.component';

describe('KategoriAsetComponent', () => {
  let component: KategoriAsetComponent;
  let fixture: ComponentFixture<KategoriAsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KategoriAsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KategoriAsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
