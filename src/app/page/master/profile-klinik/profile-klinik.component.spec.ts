import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileKlinikComponent } from './profile-klinik.component';

describe('ProfileKlinikComponent', () => {
  let component: ProfileKlinikComponent;
  let fixture: ComponentFixture<ProfileKlinikComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileKlinikComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileKlinikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
