import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrukturNomorDetailComponent } from './struktur-nomor-detail.component';

describe('StrukturNomorDetailComponent', () => {
  let component: StrukturNomorDetailComponent;
  let fixture: ComponentFixture<StrukturNomorDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrukturNomorDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrukturNomorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
