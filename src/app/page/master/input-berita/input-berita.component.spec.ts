import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputBeritaComponent } from './input-berita.component';

describe('InputBeritaComponent', () => {
  let component: InputBeritaComponent;
  let fixture: ComponentFixture<InputBeritaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputBeritaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputBeritaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
