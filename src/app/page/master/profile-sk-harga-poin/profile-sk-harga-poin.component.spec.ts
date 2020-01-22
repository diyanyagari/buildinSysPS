import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSkHargaPoinComponent } from './profile-sk-harga-poin.component';

describe('ProfileSkHargaPoinComponent', () => {
  let component: ProfileSkHargaPoinComponent;
  let fixture: ComponentFixture<ProfileSkHargaPoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSkHargaPoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSkHargaPoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
