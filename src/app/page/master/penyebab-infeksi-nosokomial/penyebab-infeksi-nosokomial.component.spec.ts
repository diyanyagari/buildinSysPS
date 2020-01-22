import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenyebabInfeksiNosokomialComponent } from './penyebab-infeksi-nosokomial.component';

describe('PenyebabInfeksiNosokomialComponent', () => {
  let component: PenyebabInfeksiNosokomialComponent;
  let fixture: ComponentFixture<PenyebabInfeksiNosokomialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenyebabInfeksiNosokomialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenyebabInfeksiNosokomialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
