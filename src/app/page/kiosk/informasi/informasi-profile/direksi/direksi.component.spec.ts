import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DireksiComponent } from './direksi.component';

describe('DireksiComponent', () => {
  let component: DireksiComponent;
  let fixture: ComponentFixture<DireksiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DireksiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DireksiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
