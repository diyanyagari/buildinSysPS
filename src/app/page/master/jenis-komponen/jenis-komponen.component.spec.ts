import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisKomponenComponent } from './jenis-komponen.component';

describe('JenisKomponenComponent', () => {
  let component: JenisKomponenComponent;
  let fixture: ComponentFixture<JenisKomponenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisKomponenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisKomponenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
