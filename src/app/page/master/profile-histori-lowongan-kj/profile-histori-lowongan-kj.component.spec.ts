import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHistoriLowonganKjComponent } from './profile-histori-lowongan-kj.component';

describe('ProfileHistoriLowonganKjComponent', () => {
  let component: ProfileHistoriLowonganKjComponent;
  let fixture: ComponentFixture<ProfileHistoriLowonganKjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileHistoriLowonganKjComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHistoriLowonganKjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
