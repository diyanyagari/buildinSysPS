import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisSertifikatComponent } from './jenis-sertifikat.component';

describe('JenisSertifikatComponent', () => {
  let component: JenisSertifikatComponent;
  let fixture: ComponentFixture<JenisSertifikatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisSertifikatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisSertifikatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
