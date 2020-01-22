import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMenuUserBaruComponent } from './preview-menu-user-baru.component';

describe('PreviewMenuUserBaruComponent', () => {
  let component: PreviewMenuUserBaruComponent;
  let fixture: ComponentFixture<PreviewMenuUserBaruComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewMenuUserBaruComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewMenuUserBaruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
