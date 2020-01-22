import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterTitlePasienComponent } from './master-title-pasien.component';

describe('MasterTitlePasienComponent', () => {
  let component: MasterTitlePasienComponent;
  let fixture: ComponentFixture<MasterTitlePasienComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterTitlePasienComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterTitlePasienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
