import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PilihDokterComponent } from './pilih-dokter.component';

describe('PilihDokterComponent', () => {
  let component: PilihDokterComponent;
  let fixture: ComponentFixture<PilihDokterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PilihDokterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PilihDokterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
