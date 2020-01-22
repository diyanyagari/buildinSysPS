import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeteranganAlasanComponent } from './keterangan-alasan.component';

describe('KeteranganAlasanComponent', () => {
  let component: KeteranganAlasanComponent;
  let fixture: ComponentFixture<KeteranganAlasanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeteranganAlasanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeteranganAlasanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
