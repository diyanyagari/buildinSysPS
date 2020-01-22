import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HargaPaketPendidikanPelatihanComponent } from './harga-paket-pendidikan-pelatihan.component';

describe('HargaPaketPendidikanPelatihanComponent', () => {
  let component: HargaPaketPendidikanPelatihanComponent;
  let fixture: ComponentFixture<HargaPaketPendidikanPelatihanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HargaPaketPendidikanPelatihanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HargaPaketPendidikanPelatihanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
