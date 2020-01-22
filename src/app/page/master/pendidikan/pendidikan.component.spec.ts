import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendidikanComponent } from './pendidikan.component';

describe('PendidikanComponent', () => {
  let component: PendidikanComponent;
  let fixture: ComponentFixture<PendidikanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendidikanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendidikanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
