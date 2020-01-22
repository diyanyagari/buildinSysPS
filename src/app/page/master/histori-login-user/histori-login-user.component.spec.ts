import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriLoginUserComponent } from './histori-login-user.component';

describe('HistoriLoginUserComponent', () => {
  let component: HistoriLoginUserComponent;
  let fixture: ComponentFixture<HistoriLoginUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriLoginUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriLoginUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
