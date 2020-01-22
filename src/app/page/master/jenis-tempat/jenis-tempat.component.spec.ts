import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisTempatComponent } from './jenis-tempat.component';

describe('JenisTempatComponent', () => {
  let component: JenisTempatComponent;
  let fixture: ComponentFixture<JenisTempatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisTempatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisTempatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
