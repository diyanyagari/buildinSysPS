import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerPelayananComponent } from './viewer-pelayanan.component';

describe('ViewerPelayananComponent', () => {
  let component: ViewerPelayananComponent;
  let fixture: ComponentFixture<ViewerPelayananComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewerPelayananComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerPelayananComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
