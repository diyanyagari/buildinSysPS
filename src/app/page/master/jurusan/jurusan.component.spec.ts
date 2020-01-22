import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JurusanComponent } from './jurusan.component';

describe('JurusanComponent', () => {
  let component: JurusanComponent;
  let fixture: ComponentFixture<JurusanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JurusanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JurusanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
