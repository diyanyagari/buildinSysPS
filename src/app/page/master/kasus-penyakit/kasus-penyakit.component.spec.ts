import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KasusPenyakitComponent } from './kasus-penyakit.component';

describe('KasusPenyakitComponent', () => {
  let component: KasusPenyakitComponent;
  let fixture: ComponentFixture<KasusPenyakitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KasusPenyakitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KasusPenyakitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
