import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SatuanHasilComponent } from './satuan-hasil.component';

describe('SatuanHasilComponent', () => {
  let component: SatuanHasilComponent;
  let fixture: ComponentFixture<SatuanHasilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SatuanHasilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SatuanHasilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
