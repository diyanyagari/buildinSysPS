import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterNewDokumenComponent } from './master-new-dokumen.component';

describe('MasterNewDokumenComponent', () => {
  let component: MasterNewDokumenComponent;
  let fixture: ComponentFixture<MasterNewDokumenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterNewDokumenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterNewDokumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
