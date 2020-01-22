import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RekananOrPartnerComponent } from './rekanan-or-partner.component';

describe('RekananOrPartnerComponent', () => {
  let component: RekananOrPartnerComponent;
  let fixture: ComponentFixture<RekananOrPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RekananOrPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RekananOrPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
