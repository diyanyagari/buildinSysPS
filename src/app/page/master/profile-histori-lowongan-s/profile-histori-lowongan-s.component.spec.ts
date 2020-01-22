import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHistoriLowonganSComponent } from './profile-histori-lowongan-s.component';

describe('ProfileHistoriLowonganSComponent', () => {
  let component: ProfileHistoriLowonganSComponent;
  let fixture: ComponentFixture<ProfileHistoriLowonganSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileHistoriLowonganSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHistoriLowonganSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
