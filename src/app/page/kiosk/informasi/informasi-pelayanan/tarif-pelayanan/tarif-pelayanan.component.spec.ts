import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifPelayananComponent } from './tarif-pelayanan.component';

describe('TarifPelayananComponent', () => {
  let component: TarifPelayananComponent;
  let fixture: ComponentFixture<TarifPelayananComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarifPelayananComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarifPelayananComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
