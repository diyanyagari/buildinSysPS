import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropinsiComponent } from './propinsi.component';

describe('PropinsiComponent', () => {
  let component: PropinsiComponent;
  let fixture: ComponentFixture<PropinsiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropinsiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropinsiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
