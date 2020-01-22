import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisKontakComponent } from './jenis-kontak.component';

describe('JenisKontakComponent', () => {
  let component: JenisKontakComponent;
  let fixture: ComponentFixture<JenisKontakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisKontakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisKontakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
