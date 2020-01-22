import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulasiNomorComponent } from './simulasi-nomor.component';

describe('SimulasiNomorComponent', () => {
  let component: SimulasiNomorComponent;
  let fixture: ComponentFixture<SimulasiNomorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulasiNomorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulasiNomorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
