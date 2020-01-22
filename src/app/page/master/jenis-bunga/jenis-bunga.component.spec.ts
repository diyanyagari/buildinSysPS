import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisBungaComponent } from './jenis-bunga.component';

describe('JenisBungaComponent', () => {
  let component: JenisBungaComponent;
  let fixture: ComponentFixture<JenisBungaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisBungaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisBungaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
