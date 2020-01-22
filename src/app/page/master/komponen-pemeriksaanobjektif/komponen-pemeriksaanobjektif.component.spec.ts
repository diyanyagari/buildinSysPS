import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KomponenPemeriksaanObjektifComponent } from './komponen.component';

describe('KomponenPemeriksaanObjektifComponent', () => {
  let component: KomponenPemeriksaanObjektifComponent;
  let fixture: ComponentFixture<KomponenPemeriksaanObjektifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KomponenPemeriksaanObjektifComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KomponenPemeriksaanObjektifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
