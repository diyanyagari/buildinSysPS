import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisKlaimComponent } from './jenis-klaim.component';

describe('JenisKlaimComponent', () => {
  let component: JenisKlaimComponent;
  let fixture: ComponentFixture<JenisKlaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisKlaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisKlaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
