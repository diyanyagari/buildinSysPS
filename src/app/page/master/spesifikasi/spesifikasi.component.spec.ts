import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpesifikasiComponent } from './spesifikasi.component';

describe('SpesifikasiComponent', () => {
  let component: SpesifikasiComponent;
  let fixture: ComponentFixture<SpesifikasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpesifikasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpesifikasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
