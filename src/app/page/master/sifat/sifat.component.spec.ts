import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SifatComponent } from './sifat.component';

describe('SifatComponent', () => {
  let component: SifatComponent;
  let fixture: ComponentFixture<SifatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SifatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SifatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
