import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiComponent } from './visi.component';

describe('VisiComponent', () => {
  let component: VisiComponent;
  let fixture: ComponentFixture<VisiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
