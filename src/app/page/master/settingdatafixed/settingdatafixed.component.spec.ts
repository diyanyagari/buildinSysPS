import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HariLiburComponent } from './harilibur.component';

describe('HariLiburComponent', () => {
  let component: ContohFormComponent;
  let fixture: ComponentFixture<HariLiburComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HariLiburComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HariLiburComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
