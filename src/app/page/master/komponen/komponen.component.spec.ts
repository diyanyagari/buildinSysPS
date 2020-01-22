import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KomponenComponent } from './komponen.component';

describe('KomponenComponent', () => {
  let component: KomponenComponent;
  let fixture: ComponentFixture<KomponenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KomponenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KomponenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
