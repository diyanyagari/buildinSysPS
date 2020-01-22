import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilHistoriVisiMisiTujuanComponent } from './profil-histori-visi-misi-tujuan.component';

describe('ProfilHistoriVisiMisiTujuanComponent', () => {
  let component: ProfilHistoriVisiMisiTujuanComponent;
  let fixture: ComponentFixture<ProfilHistoriVisiMisiTujuanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilHistoriVisiMisiTujuanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilHistoriVisiMisiTujuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
