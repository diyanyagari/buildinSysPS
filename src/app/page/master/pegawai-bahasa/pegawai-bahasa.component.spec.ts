import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiBahasaComponent } from './pegawai-bahasa.component';

describe('PegawaiBahasaComponent', () => {
  let component: PegawaiBahasaComponent;
  let fixture: ComponentFixture<PegawaiBahasaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiBahasaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiBahasaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
