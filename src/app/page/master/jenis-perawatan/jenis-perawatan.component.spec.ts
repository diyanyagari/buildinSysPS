import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisPerawatanComponent } from './jenis-perawatan.component';

describe('JenisPerawatanComponent', () => {
  let component: JenisPerawatanComponent;
  let fixture: ComponentFixture<JenisPerawatanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisPerawatanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisPerawatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
