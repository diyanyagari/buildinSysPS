import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DokumenComponent } from './dokumen.component';

describe('DokumenComponent', () => {
  let component: DokumenComponent;
  let fixture: ComponentFixture<DokumenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DokumenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DokumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
