import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KamarPerawatanComponent } from './kamar-perawatan.component';

describe('KamarPerawatanComponent', () => {
  let component: KamarPerawatanComponent;
  let fixture: ComponentFixture<KamarPerawatanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KamarPerawatanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KamarPerawatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
