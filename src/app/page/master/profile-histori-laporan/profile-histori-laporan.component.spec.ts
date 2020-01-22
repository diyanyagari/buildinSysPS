import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHistoriLaporanComponent } from './profile-histori-laporan.component';

describe('ProfileHistoriLaporanComponent', () => {
  let component: ProfileHistoriLaporanComponent;
  let fixture: ComponentFixture<ProfileHistoriLaporanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileHistoriLaporanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHistoriLaporanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
