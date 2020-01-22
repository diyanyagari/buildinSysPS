import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisiComponent } from './misi.component';

describe('MisiComponent', () => {
  let component: MisiComponent;
  let fixture: ComponentFixture<MisiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
