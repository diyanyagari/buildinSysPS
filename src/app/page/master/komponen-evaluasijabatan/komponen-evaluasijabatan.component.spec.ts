import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KomponenEvaluasiJabatanComponent } from './komponen.component';

describe('KomponenEvaluasiJabatanComponent', () => {
  let component: KomponenEvaluasiJabatanComponent;
  let fixture: ComponentFixture<KomponenEvaluasiJabatanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KomponenEvaluasiJabatanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KomponenEvaluasiJabatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
