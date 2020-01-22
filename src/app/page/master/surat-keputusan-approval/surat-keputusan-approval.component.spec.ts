import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratKeputusanApprovalComponent } from './surat-keputusan-approval.component';

describe('SuratKeputusanApprovalComponent', () => {
  let component: SuratKeputusanApprovalComponent;
  let fixture: ComponentFixture<SuratKeputusanApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuratKeputusanApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuratKeputusanApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
