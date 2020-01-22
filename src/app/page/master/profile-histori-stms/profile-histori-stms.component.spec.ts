import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHistoriStmsComponent } from './profile-histori-stms.component';

describe('ProfileHistoriStmsComponent', () => {
  let component: ProfileHistoriStmsComponent;
  let fixture: ComponentFixture<ProfileHistoriStmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileHistoriStmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHistoriStmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
