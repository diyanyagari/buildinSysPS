import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EselonFormComponent } from './eselon-form.component';

describe('EselonFormComponent', () => {
  let component: EselonFormComponent;
  let fixture: ComponentFixture<EselonFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EselonFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EselonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
