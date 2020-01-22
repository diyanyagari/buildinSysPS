import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisKonstruksiComponent } from './jenis-konstruksi.component';

describe('JenisKonstruksiComponent', () => {
  let component: JenisKonstruksiComponent;
  let fixture: ComponentFixture<JenisKonstruksiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisKonstruksiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisKonstruksiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
