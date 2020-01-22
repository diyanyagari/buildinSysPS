import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelompokEvaluasiComponent } from './kelompok-evaluasi.component';

describe('KelompokEvaluasiComponent', () => {
  let component: KelompokEvaluasiComponent;
  let fixture: ComponentFixture<KelompokEvaluasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelompokEvaluasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelompokEvaluasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
