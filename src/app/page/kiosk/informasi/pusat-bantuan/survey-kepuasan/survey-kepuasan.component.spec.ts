import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyKepuasanComponent } from './survey-kepuasan.component';

describe('SurveyKepuasanComponent', () => {
  let component: SurveyKepuasanComponent;
  let fixture: ComponentFixture<SurveyKepuasanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyKepuasanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyKepuasanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
