import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeLiburHariKerjaNormalComponent } from './ruangan.component';

describe('RangeLiburHariKerjaNormalComponent', () => {
  let component: RangeLiburHariKerjaNormalComponent;
  let fixture: ComponentFixture<RangeLiburHariKerjaNormalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeLiburHariKerjaNormalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeLiburHariKerjaNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
