import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisTarifComponent } from './jenis-tarif.component';

describe('JenisTarifComponent', () => {
  let component: JenisTarifComponent;
  let fixture: ComponentFixture<JenisTarifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisTarifComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisTarifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
