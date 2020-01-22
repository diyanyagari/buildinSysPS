import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubunganKeluargaComponent } from './hubungan-keluarga.component';

describe('HubunganKeluargaComponent', () => {
  let component: HubunganKeluargaComponent;
  let fixture: ComponentFixture<HubunganKeluargaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubunganKeluargaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubunganKeluargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
