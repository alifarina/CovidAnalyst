import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpListComponent } from './gp-list.component';

describe('GpListComponent', () => {
  let component: GpListComponent;
  let fixture: ComponentFixture<GpListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
