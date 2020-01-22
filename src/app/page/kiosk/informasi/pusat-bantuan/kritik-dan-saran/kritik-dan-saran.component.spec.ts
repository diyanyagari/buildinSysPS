import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KritikDanSaranComponent } from './kritik-dan-saran.component';

describe('KritikDanSaranComponent', () => {
  let component: KritikDanSaranComponent;
  let fixture: ComponentFixture<KritikDanSaranComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KritikDanSaranComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KritikDanSaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
