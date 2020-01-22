import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerbaruComponent } from './terbaru.component';

describe('TerbaruComponent', () => {
  let component: TerbaruComponent;
  let fixture: ComponentFixture<TerbaruComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerbaruComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerbaruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
