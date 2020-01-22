import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlatComponent } from './alat.component';

describe('AlatComponent', () => {
  let component: AlatComponent;
  let fixture: ComponentFixture<AlatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
