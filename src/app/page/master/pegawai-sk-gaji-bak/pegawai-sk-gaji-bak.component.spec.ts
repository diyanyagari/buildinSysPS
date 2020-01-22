import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiSkGajiBakComponent } from './pegawai-sk-gaji-bak.component';

describe('PegawaiSkGajiBakComponent', () => {
  let component: PegawaiSkGajiBakComponent;
  let fixture: ComponentFixture<PegawaiSkGajiBakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiSkGajiBakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiSkGajiBakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
