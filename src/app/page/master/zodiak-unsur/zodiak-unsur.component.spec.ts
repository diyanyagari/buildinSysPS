import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZodiakUnsurComponent } from './zodiak-unsur.component';

describe('ZodiakUnsurComponent', () => {
  let component: ZodiakUnsurComponent;
  let fixture: ComponentFixture<ZodiakUnsurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZodiakUnsurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZodiakUnsurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
