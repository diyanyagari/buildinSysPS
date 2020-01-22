import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiSkKarierPathComponent } from './pegawai-sk-karier-path.component';

describe('PegawaiSkKarierPathComponent', () => {
  let component: PegawaiSkKarierPathComponent;
  let fixture: ComponentFixture<PegawaiSkKarierPathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiSkKarierPathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiSkKarierPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
