import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisKomponenIndexComponent } from './jenis-komponen-index.component';

describe('JenisKomponenIndexComponent', () => {
  let component: JenisKomponenIndexComponent;
  let fixture: ComponentFixture<JenisKomponenIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisKomponenIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisKomponenIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
