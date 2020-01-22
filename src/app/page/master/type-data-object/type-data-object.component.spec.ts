import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeDataObjectComponent } from './type-data-object.component';

describe('TypeDataObjectComponent', () => {
  let component: TypeDataObjectComponent;
  let fixture: ComponentFixture<TypeDataObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeDataObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeDataObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
