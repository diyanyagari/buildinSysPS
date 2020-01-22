import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisPasienLamaComponent } from './jenis-pasien-lama.component';

describe('JenisPasienLamaComponent', () => {
  let component: JenisPasienLamaComponent;
  let fixture: ComponentFixture<JenisPasienLamaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisPasienLamaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisPasienLamaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
