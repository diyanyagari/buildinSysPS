import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitlePegawaiComponent } from './title-pegawai.component';

describe('TitlePegawaiComponent', () => {
  let component: TitlePegawaiComponent;
  let fixture: ComponentFixture<TitlePegawaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitlePegawaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitlePegawaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
