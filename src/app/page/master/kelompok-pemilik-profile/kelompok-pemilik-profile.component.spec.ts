import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelompokPemilikProfileComponent } from './kelompok-pemilik-profile.component';

describe('KelompokPemilikProfileComponent', () => {
  let component: KelompokPemilikProfileComponent;
  let fixture: ComponentFixture<KelompokPemilikProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelompokPemilikProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelompokPemilikProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
