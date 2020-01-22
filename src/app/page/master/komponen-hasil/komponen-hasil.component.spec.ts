import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KomponenHasilComponent } from './komponen-hasil.component';

describe('KomponenHasilComponent', () => {
  let component: KomponenHasilComponent;
  let fixture: ComponentFixture<KomponenHasilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KomponenHasilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KomponenHasilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
