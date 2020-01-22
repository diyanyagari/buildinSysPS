import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestasiOrAwardComponent } from './prestasi-or-award.component';

describe('PrestasiOrAwardComponent', () => {
  let component: PrestasiOrAwardComponent;
  let fixture: ComponentFixture<PrestasiOrAwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestasiOrAwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestasiOrAwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
