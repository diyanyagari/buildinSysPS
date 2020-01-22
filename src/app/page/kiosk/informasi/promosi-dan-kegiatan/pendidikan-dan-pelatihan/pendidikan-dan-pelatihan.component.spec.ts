import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendidikanDanPelatihanComponent } from './pendidikan-dan-pelatihan.component';

describe('PendidikanDanPelatihanComponent', () => {
  let component: PendidikanDanPelatihanComponent;
  let fixture: ComponentFixture<PendidikanDanPelatihanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendidikanDanPelatihanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendidikanDanPelatihanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
