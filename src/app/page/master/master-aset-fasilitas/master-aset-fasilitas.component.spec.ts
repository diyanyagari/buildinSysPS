import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAsetFasilitasComponent } from './pengajuanpinjaman.component';

describe('MasterAsetFasilitasComponent', () => {
  let component: MasterAsetFasilitasComponent;
  let fixture: ComponentFixture<MasterAsetFasilitasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterAsetFasilitasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterAsetFasilitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
