import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KecamatanComponent } from './kecamatan.component';

describe('KecamatanComponent', () => {
  let component: KecamatanComponent;
  let fixture: ComponentFixture<KecamatanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KecamatanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KecamatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
