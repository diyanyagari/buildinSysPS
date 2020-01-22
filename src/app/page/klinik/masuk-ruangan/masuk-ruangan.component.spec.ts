import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasukRuanganComponent } from './masuk-ruangan.component';

describe('MasukRuanganComponent', () => {
  let component: MasukRuanganComponent;
  let fixture: ComponentFixture<MasukRuanganComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasukRuanganComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasukRuanganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
