import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProsedurPelayananComponent } from './prosedur-pelayanan.component';

describe('ProsedurPelayananComponent', () => {
  let component: ProsedurPelayananComponent;
  let fixture: ComponentFixture<ProsedurPelayananComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProsedurPelayananComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProsedurPelayananComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
