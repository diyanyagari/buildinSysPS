import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisKeputusanComponent } from './jenis-keputusan.component';

describe('JenisKeputusanComponent', () => {
  let component: JenisKeputusanComponent;
  let fixture: ComponentFixture<JenisKeputusanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisKeputusanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisKeputusanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
