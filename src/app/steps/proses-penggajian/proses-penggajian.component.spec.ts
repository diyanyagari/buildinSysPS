import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProsesPenggajianComponent } from './proses-penggajian.component';

describe('ProsesPenggajianComponent', () => {
  let component: ProsesPenggajianComponent;
  let fixture: ComponentFixture<ProsesPenggajianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProsesPenggajianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProsesPenggajianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
