import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgamaComponent } from './agama.component';

describe('AgamaComponent', () => {
  let component: AgamaComponent;
  let fixture: ComponentFixture<AgamaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgamaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgamaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
