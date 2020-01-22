import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenghasilanTidakKenaPajakComponent } from './penghasilan-tidak-kena-pajak.component';

describe('PenghasilanTidakKenaPajakComponent', () => {
  let component: PenghasilanTidakKenaPajakComponent;
  let fixture: ComponentFixture<PenghasilanTidakKenaPajakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenghasilanTidakKenaPajakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenghasilanTidakKenaPajakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
