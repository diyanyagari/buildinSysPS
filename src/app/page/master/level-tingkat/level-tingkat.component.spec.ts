import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelTingkatComponent } from './level-tingkat.component';

describe('LevelTingkatComponent', () => {
  let component: LevelTingkatComponent;
  let fixture: ComponentFixture<LevelTingkatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelTingkatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelTingkatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
