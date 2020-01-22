import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsalComponent } from './asal.component';

describe('AsalComponent', () => {
  let component: AsalComponent;
  let fixture: ComponentFixture<AsalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
