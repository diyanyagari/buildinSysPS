import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualHelpComponent } from './manual-help.component';

describe('ManualHelpComponent', () => {
  let component: ManualHelpComponent;
  let fixture: ComponentFixture<ManualHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
