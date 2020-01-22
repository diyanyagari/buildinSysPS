import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisWaktuComponent } from './jenis-waktu.component';

describe('JenisWaktuComponent', () => {
  let component: JenisWaktuComponent;
  let fixture: ComponentFixture<JenisWaktuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisWaktuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisWaktuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
