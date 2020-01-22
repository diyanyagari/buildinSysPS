import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiSkGajiBaComponent } from './pegawai-sk-gaji-ba.component';

describe('PegawaiSkGajiBaComponent', () => {
  let component: PegawaiSkGajiBaComponent;
  let fixture: ComponentFixture<PegawaiSkGajiBaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiSkGajiBaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiSkGajiBaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
