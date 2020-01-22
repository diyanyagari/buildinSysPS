import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GolonganPegawaiFormComponent } from './golonganPegawai-form.component';

describe('GolonganPegawaiFormComponent', () => {
  let component: GolonganPegawaiFormComponent;
  let fixture: ComponentFixture<GolonganPegawaiFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GolonganPegawaiFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GolonganPegawaiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});