import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GolonganAsuransiComponent } from './golongan-asuransi.component';

describe('GolonganAsuransiComponent', () => {
  let component: GolonganAsuransiComponent;
  let fixture: ComponentFixture<GolonganAsuransiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GolonganAsuransiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GolonganAsuransiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
