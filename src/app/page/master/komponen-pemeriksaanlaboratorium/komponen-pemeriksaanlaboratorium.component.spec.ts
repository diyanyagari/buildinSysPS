import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KomponenPemeriksaanLaboratoriumComponent } from './komponen.component';

describe('KomponenPemeriksaanLaboratoriumComponent', () => {
  let component: KomponenPemeriksaanLaboratoriumComponent;
  let fixture: ComponentFixture<KomponenPemeriksaanLaboratoriumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KomponenPemeriksaanLaboratoriumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KomponenPemeriksaanLaboratoriumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
