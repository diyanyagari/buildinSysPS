import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignConfigurationComponent } from './design-configuration.component';

describe('DesignConfigurationComponent', () => {
  let component: DesignConfigurationComponent;
  let fixture: ComponentFixture<DesignConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
