import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisPasienComponent } from './jenis-pasien.component';

describe('JenisPasienComponent', () => {
  let component: JenisPasienComponent;
  let fixture: ComponentFixture<JenisPasienComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisPasienComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisPasienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
