import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisPasienBaruComponent } from './jenis-pasien-baru.component';

describe('JenisPasienBaruComponent', () => {
  let component: JenisPasienBaruComponent;
  let fixture: ComponentFixture<JenisPasienBaruComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisPasienBaruComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisPasienBaruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
