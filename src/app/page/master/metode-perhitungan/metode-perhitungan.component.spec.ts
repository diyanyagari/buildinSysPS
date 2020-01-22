import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodePerhitunganComponent } from './metode-perhitungan.component';

describe('MetodePerhitunganComponent', () => {
  let component: MetodePerhitunganComponent;
  let fixture: ComponentFixture<MetodePerhitunganComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetodePerhitunganComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetodePerhitunganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
