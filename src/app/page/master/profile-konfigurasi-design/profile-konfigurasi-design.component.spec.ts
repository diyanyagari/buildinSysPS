import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileKonfigurasiDesignComponent } from './profile-konfigurasi-design.component';

describe('ProfileKonfigurasiDesignComponent', () => {
  let component: ProfileKonfigurasiDesignComponent;
  let fixture: ComponentFixture<ProfileKonfigurasiDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileKonfigurasiDesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileKonfigurasiDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
