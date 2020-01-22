import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrukturNomorComponent } from './struktur-nomor.component';

describe('StrukturNomorComponent', () => {
  let component: StrukturNomorComponent;
  let fixture: ComponentFixture<StrukturNomorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrukturNomorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrukturNomorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
