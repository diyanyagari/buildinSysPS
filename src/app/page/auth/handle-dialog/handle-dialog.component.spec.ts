import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleDialogComponent } from './handle-dialog.component';

describe('HandleDialogComponent', () => {
  let component: HandleDialogComponent;
  let fixture: ComponentFixture<HandleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
