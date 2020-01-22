import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileStrukturGajiByMkgpComponent } from './profile-struktur-gaji-by-mkgp.component';

describe('ProfileStrukturGajiByMkgpComponent', () => {
  let component: ProfileStrukturGajiByMkgpComponent;
  let fixture: ComponentFixture<ProfileStrukturGajiByMkgpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileStrukturGajiByMkgpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileStrukturGajiByMkgpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
