import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratKeputusanComponent } from './surat-keputusan.component';

describe('SuratKeputusanComponent', () => {
  let component: SuratKeputusanComponent;
  let fixture: ComponentFixture<SuratKeputusanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuratKeputusanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuratKeputusanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
