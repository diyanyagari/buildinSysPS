import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisPaketComponent } from './jenis-paket.component';

describe('JenisPaketComponent', () => {
  let component: JenisPaketComponent;
  let fixture: ComponentFixture<JenisPaketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenisPaketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisPaketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
