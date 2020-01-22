import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KategoriGajiComponent } from './kategori-gaji.component';

describe('KategoriGajiComponent', () => {
  let component: KategoriGajiComponent;
  let fixture: ComponentFixture<KategoriGajiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KategoriGajiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KategoriGajiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
