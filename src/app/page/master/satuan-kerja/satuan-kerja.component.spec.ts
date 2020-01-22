import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SatuanKerjaComponent } from './satuan-kerja.component';

describe('SatuanKerjaComponent', () => {
  let component: SatuanKerjaComponent;
  let fixture: ComponentFixture<SatuanKerjaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SatuanKerjaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SatuanKerjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
