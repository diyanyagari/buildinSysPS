import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeskripsiComponent } from './deskripsi.component';

describe('DeskripsiComponent', () => {
  let component: DeskripsiComponent;
  let fixture: ComponentFixture<DeskripsiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeskripsiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeskripsiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
