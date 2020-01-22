import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelompokUmurComponent } from './kelompok-umur.component';

describe('KelompokUmurComponent', () => {
  let component: KelompokUmurComponent;
  let fixture: ComponentFixture<KelompokUmurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelompokUmurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelompokUmurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
