import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterMisiComponent } from './master-misi.component';

describe('MasterMisiComponent', () => {
  let component: MasterMisiComponent;
  let fixture: ComponentFixture<MasterMisiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterMisiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterMisiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
