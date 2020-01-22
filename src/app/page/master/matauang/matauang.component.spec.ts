import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatauangComponent } from './matauang.component';

describe('MatauangComponent', () => {
  let component: MatauangComponent;
  let fixture: ComponentFixture<MatauangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatauangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatauangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
