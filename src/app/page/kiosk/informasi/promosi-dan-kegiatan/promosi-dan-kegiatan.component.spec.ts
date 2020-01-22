import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromosiDanKegiatanComponent } from './promosi-dan-kegiatan.component';

describe('PromosiDanKegiatanComponent', () => {
  let component: PromosiDanKegiatanComponent;
  let fixture: ComponentFixture<PromosiDanKegiatanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromosiDanKegiatanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromosiDanKegiatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
