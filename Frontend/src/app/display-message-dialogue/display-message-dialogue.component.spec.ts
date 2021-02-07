import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayMessageDialogueComponent } from './display-message-dialogue.component';

describe('DisplayMessageDialogueComponent', () => {
  let component: DisplayMessageDialogueComponent;
  let fixture: ComponentFixture<DisplayMessageDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayMessageDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayMessageDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
