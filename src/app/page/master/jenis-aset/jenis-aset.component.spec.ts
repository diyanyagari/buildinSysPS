import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisAsetComponent } from './jenis-aset.component';

describe('JenisAsetComponent', () => {
  let component: JenisAsetComponent;
  let fixture: ComponentFixture<JenisAsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisAsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisAsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
