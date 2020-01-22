import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterRekananComponent } from './master-rekanan.component';

describe('MasterRekananComponent', () => {
  let component: MasterRekananComponent;
  let fixture: ComponentFixture<MasterRekananComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterRekananComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterRekananComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
