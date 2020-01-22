import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PekerjaanComponent } from './pekerjaan.component';

describe('PekerjaanComponent', () => {
  let component: PekerjaanComponent;
  let fixture: ComponentFixture<PekerjaanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PekerjaanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PekerjaanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
