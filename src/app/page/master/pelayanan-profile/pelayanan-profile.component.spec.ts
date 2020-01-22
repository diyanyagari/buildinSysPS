import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PelayananProfileComponent } from './pelayanan-profile.component';

describe('PelayananProfileComponent', () => {
  let component: PelayananProfileComponent;
  let fixture: ComponentFixture<PelayananProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PelayananProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PelayananProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
