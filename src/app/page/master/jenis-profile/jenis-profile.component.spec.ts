import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisProfileComponent } from './jenis-profile.component';

describe('JenisProfileComponent', () => {
  let component: JenisProfileComponent;
  let fixture: ComponentFixture<JenisProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
