import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodePerhitunganStatusComponent } from './metode-perhitungan-status.component';

describe('MetodePerhitunganStatusComponent', () => {
  let component: MetodePerhitunganStatusComponent;
  let fixture: ComponentFixture<MetodePerhitunganStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetodePerhitunganStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetodePerhitunganStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
