import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KomponenGajiComponent } from './komponen.component';

describe('KomponenGajiComponent', () => {
  let component: KomponenGajiComponent;
  let fixture: ComponentFixture<KomponenGajiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KomponenGajiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KomponenGajiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
