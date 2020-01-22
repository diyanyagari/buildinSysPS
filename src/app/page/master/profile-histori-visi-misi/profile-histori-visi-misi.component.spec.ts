import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHistoriVisiMisiComponent } from './profile-histori-visi-misi.component';

describe('ProfileHistoriVisiMisiComponent', () => {
  let component: ProfileHistoriVisiMisiComponent;
  let fixture: ComponentFixture<ProfileHistoriVisiMisiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileHistoriVisiMisiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHistoriVisiMisiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
