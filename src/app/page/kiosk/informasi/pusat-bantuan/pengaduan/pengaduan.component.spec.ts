import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PengaduanComponent } from './pengaduan.component';

describe('PengaduanComponent', () => {
  let component: PengaduanComponent;
  let fixture: ComponentFixture<PengaduanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PengaduanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PengaduanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
