import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHistoryStrategyMapDepartmentComponent } from './profile-history-strategy-map-department.component';

describe('ProfileHistoryStrategyMapDepartmentComponent', () => {
  let component: ProfileHistoryStrategyMapDepartmentComponent;
  let fixture: ComponentFixture<ProfileHistoryStrategyMapDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileHistoryStrategyMapDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHistoryStrategyMapDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
