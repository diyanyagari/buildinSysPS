import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSkKomponenGajiComponent } from './profile-sk-komponen-gaji.component';

describe('ProfileSkKomponenGajiComponent', () => {
  let component: ProfileSkKomponenGajiComponent;
  let fixture: ComponentFixture<ProfileSkKomponenGajiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSkKomponenGajiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSkKomponenGajiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
