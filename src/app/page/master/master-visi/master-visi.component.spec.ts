import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterVisiComponent } from './master-visi.component';

describe('MasterVisiComponent', () => {
  let component: MasterVisiComponent;
  let fixture: ComponentFixture<MasterVisiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterVisiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterVisiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
