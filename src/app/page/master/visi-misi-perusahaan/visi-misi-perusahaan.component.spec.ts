import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiMisiPerusahaanComponent } from './visi-misi-perusahaan.component';

describe('VisiMisiPerusahaanComponent', () => {
  let component: VisiMisiPerusahaanComponent;
  let fixture: ComponentFixture<VisiMisiPerusahaanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiMisiPerusahaanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiMisiPerusahaanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
