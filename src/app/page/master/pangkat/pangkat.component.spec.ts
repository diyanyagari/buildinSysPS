import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PangkatComponent } from './pangkat.component';

describe('PangkatComponent', () => {
  let component: PangkatComponent;
  let fixture: ComponentFixture<PangkatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PangkatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PangkatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
