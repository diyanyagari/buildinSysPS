import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisRekananComponent } from './jenis-rekanan.component';

describe('JenisRekananComponent', () => {
  let component: JenisRekananComponent;
  let fixture: ComponentFixture<JenisRekananComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisRekananComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisRekananComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
