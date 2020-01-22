import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesaKelurahanComponent } from './desa-kelurahan.component';

describe('DesaKelurahanComponent', () => {
  let component: DesaKelurahanComponent;
  let fixture: ComponentFixture<DesaKelurahanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesaKelurahanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesaKelurahanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
