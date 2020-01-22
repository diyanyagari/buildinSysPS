import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FasilitasPelayananComponent } from './fasilitas-pelayanan.component';

describe('FasilitasPelayananComponent', () => {
  let component: FasilitasPelayananComponent;
  let fixture: ComponentFixture<FasilitasPelayananComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FasilitasPelayananComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FasilitasPelayananComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
