import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PemilikProfileComponent } from './pemilik-profile.component';

describe('PemilikProfileComponent', () => {
  let component: PemilikProfileComponent;
  let fixture: ComponentFixture<PemilikProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PemilikProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PemilikProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
