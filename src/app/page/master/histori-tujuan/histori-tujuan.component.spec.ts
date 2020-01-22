import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriTujuanComponent } from './histori-tujuan.component';

describe('HistoriTujuanComponent', () => {
  let component: HistoriTujuanComponent;
  let fixture: ComponentFixture<HistoriTujuanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriTujuanComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriTujuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
