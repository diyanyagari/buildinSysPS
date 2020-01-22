import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDiskonComponent } from './master-diskon.component';

describe('MasterDiskonComponent', () => {
  let component: MasterDiskonComponent;
  let fixture: ComponentFixture<MasterDiskonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterDiskonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDiskonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
