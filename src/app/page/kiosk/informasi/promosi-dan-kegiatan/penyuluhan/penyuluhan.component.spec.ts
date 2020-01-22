import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenyuluhanComponent } from './penyuluhan.component';

describe('PenyuluhanComponent', () => {
  let component: PenyuluhanComponent;
  let fixture: ComponentFixture<PenyuluhanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenyuluhanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenyuluhanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
