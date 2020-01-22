import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HargaPaketPenjaminComponent } from './harga-paket-penjamin.component';

describe('HargaPaketPenjaminComponent', () => {
  let component: HargaPaketPenjaminComponent;
  let fixture: ComponentFixture<HargaPaketPenjaminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HargaPaketPenjaminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HargaPaketPenjaminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
