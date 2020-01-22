import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerbaruDetailComponent } from './terbaru-detail.component';

describe('TerbaruDetailComponent', () => {
  let component: TerbaruDetailComponent;
  let fixture: ComponentFixture<TerbaruDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerbaruDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerbaruDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
