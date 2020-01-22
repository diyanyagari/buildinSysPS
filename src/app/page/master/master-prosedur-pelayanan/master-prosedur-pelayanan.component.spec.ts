import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterProsedurPelayananComponent } from './master-prosedur-pelayanan.component';

describe('MasterProsedurPelayananComponent', () => {
  let component: MasterProsedurPelayananComponent;
  let fixture: ComponentFixture<MasterProsedurPelayananComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterProsedurPelayananComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterProsedurPelayananComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
