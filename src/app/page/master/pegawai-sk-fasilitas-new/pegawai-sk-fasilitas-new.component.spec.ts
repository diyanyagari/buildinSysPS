import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiSkFasilitasNewComponent } from './pegawai-sk-fasilitas-new.component';

describe('PegawaiSkFasilitasNewComponent', () => {
  let component: PegawaiSkFasilitasNewComponent;
  let fixture: ComponentFixture<PegawaiSkFasilitasNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiSkFasilitasNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiSkFasilitasNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
