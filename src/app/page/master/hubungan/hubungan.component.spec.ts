import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubunganComponent } from './hubungan.component';

describe('HubunganComponent', () => {
  let component: HubunganComponent;
  let fixture: ComponentFixture<HubunganComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubunganComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubunganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
