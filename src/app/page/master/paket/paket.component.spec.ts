import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaketComponent } from './paket.component';

describe('PaketComponent', () => {
  let component: PaketComponent;
  let fixture: ComponentFixture<PaketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
