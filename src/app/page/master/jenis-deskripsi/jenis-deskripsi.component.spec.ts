import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisDeskripsiComponent } from './jenis-deskripsi.component';

describe('JenisDeskripsiComponent', () => {
  let component: JenisDeskripsiComponent;
  let fixture: ComponentFixture<JenisDeskripsiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisDeskripsiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisDeskripsiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
