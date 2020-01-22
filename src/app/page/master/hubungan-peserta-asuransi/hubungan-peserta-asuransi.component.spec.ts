import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubunganPesertaAsuransiComponent } from './hubungan-peserta-asuransi.component';

describe('HubunganPesertaAsuransiComponent', () => {
  let component: HubunganPesertaAsuransiComponent;
  let fixture: ComponentFixture<HubunganPesertaAsuransiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubunganPesertaAsuransiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubunganPesertaAsuransiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
