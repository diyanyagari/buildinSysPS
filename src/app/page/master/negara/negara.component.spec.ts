import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NegaraComponent } from './negara.component';

describe('NegaraComponent', () => {
  let component: NegaraComponent;
  let fixture: ComponentFixture<NegaraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NegaraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
