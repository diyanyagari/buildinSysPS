import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiSkStatusComponent } from './kecamatan.component';

describe('PegawaiSkStatusComponent', () => {
  let component: PegawaiSkStatusComponent;
  let fixture: ComponentFixture<PegawaiSkStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiSkStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiSkStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
