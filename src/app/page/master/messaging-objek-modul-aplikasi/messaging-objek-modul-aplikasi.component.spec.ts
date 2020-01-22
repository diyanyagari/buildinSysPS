import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagingObjekModulAplikasiComponent } from './messaging-objek-modul-aplikasi.component';

describe('MessagingObjekModulAplikasiComponent', () => {
  let component: MessagingObjekModulAplikasiComponent;
  let fixture: ComponentFixture<MessagingObjekModulAplikasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagingObjekModulAplikasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagingObjekModulAplikasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
