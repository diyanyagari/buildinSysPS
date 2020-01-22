import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAndGalleryComponent } from './event-and-gallery.component';

describe('EventAndGalleryComponent', () => {
  let component: EventAndGalleryComponent;
  let fixture: ComponentFixture<EventAndGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAndGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAndGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
