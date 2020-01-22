import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PusatBantuanComponent } from './pusat-bantuan.component';

describe('PusatBantuanComponent', () => {
  let component: PusatBantuanComponent;
  let fixture: ComponentFixture<PusatBantuanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PusatBantuanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PusatBantuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
