import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformasiProfileComponent } from './informasi-profile.component';

describe('InformasiProfileComponent', () => {
  let component: InformasiProfileComponent;
  let fixture: ComponentFixture<InformasiProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformasiProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformasiProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
