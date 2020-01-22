import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelompokPenyebabDiagnosaComponent } from './kelompok-penyebab-diagnosa.component';

describe('KelompokPenyebabDiagnosaComponent', () => {
  let component: KelompokPenyebabDiagnosaComponent;
  let fixture: ComponentFixture<KelompokPenyebabDiagnosaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelompokPenyebabDiagnosaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelompokPenyebabDiagnosaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
