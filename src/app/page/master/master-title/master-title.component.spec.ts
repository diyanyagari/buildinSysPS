import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterTitleComponent } from './master-title.component';

describe('MasterTitleComponent', () => {
  let component: MasterTitleComponent;
  let fixture: ComponentFixture<MasterTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
