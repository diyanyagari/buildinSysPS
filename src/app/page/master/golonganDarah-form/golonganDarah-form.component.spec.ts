import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GolonganDarahFormComponent } from './golonganDarah-form.component';

describe('GolonganDarahFormComponent', () => {
  let component: GolonganDarahFormComponent;
  let fixture: ComponentFixture<GolonganDarahFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GolonganDarahFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GolonganDarahFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
