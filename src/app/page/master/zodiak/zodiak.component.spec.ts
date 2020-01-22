import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZodiakComponent } from './zodiak.component';

describe('ZodiakComponent', () => {
  let component: ZodiakComponent;
  let fixture: ComponentFixture<ZodiakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZodiakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZodiakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
