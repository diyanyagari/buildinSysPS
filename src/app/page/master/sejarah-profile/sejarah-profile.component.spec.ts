import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SejarahProfileComponent } from './sejarah-profile.component';

describe('SejarahProfileComponent', () => {
  let component: SejarahProfileComponent;
  let fixture: ComponentFixture<SejarahProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SejarahProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SejarahProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
