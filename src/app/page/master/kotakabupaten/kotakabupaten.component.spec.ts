import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KotakabupatenComponent } from './kotakabupaten.component';

describe('KotakabupatenComponent', () => {
  let component: KotakabupatenComponent;
  let fixture: ComponentFixture<KotakabupatenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KotakabupatenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KotakabupatenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
