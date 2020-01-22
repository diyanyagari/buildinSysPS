import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HargaPaketPelayananComponent } from './harga-paket-pelayanan.component';

describe('HargaPaketPenjaminComponent', () => {
  let component: HargaPaketPelayananComponent;
  let fixture: ComponentFixture<HargaPaketPelayananComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HargaPaketPelayananComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HargaPaketPelayananComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
