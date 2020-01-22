import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypePegawaiComponent } from './type-pegawai.component';

describe('TypePegawaiComponent', () => {
  let component: TypePegawaiComponent;
  let fixture: ComponentFixture<TypePegawaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypePegawaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypePegawaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
