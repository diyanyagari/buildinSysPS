import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiSkStatusRevtabComponent } from './pegawai-sk-status-revtab.component';

describe('PegawaiSkStatusRevtabComponent', () => {
  let component: PegawaiSkStatusRevtabComponent;
  let fixture: ComponentFixture<PegawaiSkStatusRevtabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiSkStatusRevtabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiSkStatusRevtabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
