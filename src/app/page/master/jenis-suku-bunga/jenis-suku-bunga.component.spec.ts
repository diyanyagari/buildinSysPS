import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisSukuBungaComponent } from './jenis-suku-bunga.component';

describe('JenisSukuBungaComponent', () => {
  let component: JenisSukuBungaComponent;
  let fixture: ComponentFixture<JenisSukuBungaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisSukuBungaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisSukuBungaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
