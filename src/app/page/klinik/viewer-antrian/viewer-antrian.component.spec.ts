import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerAntrianComponent } from './viewer-antrian.component';

describe('ViewerAntrianComponent', () => {
  let component: ViewerAntrianComponent;
  let fixture: ComponentFixture<ViewerAntrianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewerAntrianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerAntrianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
