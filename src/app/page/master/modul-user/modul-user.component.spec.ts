import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulUserComponent } from './modul-user.component';

describe('ModulUserComponent', () => {
  let component: ModulUserComponent;
  let fixture: ComponentFixture<ModulUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
