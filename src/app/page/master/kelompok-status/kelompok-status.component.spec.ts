import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelompokStatusComponent } from './kelompok-status.component;

describe('KelompokStatusComponent', () => {
  let component: KelompokStatusComponent;
  let fixture: ComponentFixture<KelompokStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelompokStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelompokStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
