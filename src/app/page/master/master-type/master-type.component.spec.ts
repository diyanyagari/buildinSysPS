import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterTypeComponent } from './master-type.component';

describe('MasterTypeComponent', () => {
  let component: MasterTypeComponent;
  let fixture: ComponentFixture<MasterTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
