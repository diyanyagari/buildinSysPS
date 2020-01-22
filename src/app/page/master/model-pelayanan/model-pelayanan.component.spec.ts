import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPelayananComponent } from './model-pelayanan.component';

describe('ModelPelayananComponent', () => {
  let component: ModelPelayananComponent;
  let fixture: ComponentFixture<ModelPelayananComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelPelayananComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelPelayananComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
