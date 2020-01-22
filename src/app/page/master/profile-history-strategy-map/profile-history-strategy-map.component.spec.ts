import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHistoryStrategyMapComponent } from './profile-history-strategy-map.component';

describe('ProfileHistoryStrategyMapComponent', () => {
  let component: ProfileHistoryStrategyMapComponent;
  let fixture: ComponentFixture<ProfileHistoryStrategyMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileHistoryStrategyMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHistoryStrategyMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
