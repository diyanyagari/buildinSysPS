import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeProfileComponent } from './type-profile.component';

describe('TypeProfileComponent', () => {
  let component: TypeProfileComponent;
  let fixture: ComponentFixture<TypeProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
