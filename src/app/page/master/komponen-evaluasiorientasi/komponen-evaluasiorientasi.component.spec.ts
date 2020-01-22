import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KomponenEvaluasiOrientasiComponent } from './komponen.component';

describe('KomponenEvaluasiOrientasiComponent', () => {
  let component: KomponenEvaluasiOrientasiComponent;
  let fixture: ComponentFixture<KomponenEvaluasiOrientasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KomponenEvaluasiOrientasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KomponenEvaluasiOrientasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
