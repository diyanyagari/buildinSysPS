import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiSkStatusDinasComponent } from './pegawai-sk-status-dinas.component';

describe('PegawaiSkStatusDinasComponent', () => {
  let component: PegawaiSkStatusDinasComponent;
  let fixture: ComponentFixture<PegawaiSkStatusDinasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiSkStatusDinasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiSkStatusDinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
