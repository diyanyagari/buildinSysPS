import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenyebabDiagnosaComponent } from './penyebab-diagnosa.component';

describe('PenyebabDiagnosaComponent', () => {
  let component: PenyebabDiagnosaComponent;
  let fixture: ComponentFixture<PenyebabDiagnosaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenyebabDiagnosaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenyebabDiagnosaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
