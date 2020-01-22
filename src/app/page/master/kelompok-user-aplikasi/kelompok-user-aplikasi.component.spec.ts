import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelompokUserAplikasiComponent } from './kelompok-user-aplikasi.component';

describe('KelompokUserAplikasiComponent', () => {
  let component: KelompokUserAplikasiComponent;
  let fixture: ComponentFixture<KelompokUserAplikasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelompokUserAplikasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelompokUserAplikasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
