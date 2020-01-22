import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardOffenceComponent } from './award-offence.component';

describe('AwardOffenceComponent', () => {
  let component: AwardOffenceComponent;
  let fixture: ComponentFixture<AwardOffenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardOffenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardOffenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
