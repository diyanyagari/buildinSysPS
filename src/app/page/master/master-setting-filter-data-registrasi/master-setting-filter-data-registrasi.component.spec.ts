import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSettingFilterDataRegistrasiComponent } from './master-setting-filter-data-registrasi.component';

describe('MasterSettingFilterDataRegistrasiComponent', () => {
  let component: MasterSettingFilterDataRegistrasiComponent;
  let fixture: ComponentFixture<MasterSettingFilterDataRegistrasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterSettingFilterDataRegistrasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterSettingFilterDataRegistrasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
