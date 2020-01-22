import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RekananComponent } from './rekanan.component';

describe('RekananComponent', () => {
  let component: RekananComponent;
  let fixture: ComponentFixture<RekananComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RekananComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RekananComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
