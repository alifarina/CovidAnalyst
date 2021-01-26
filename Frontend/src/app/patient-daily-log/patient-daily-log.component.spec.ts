import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDailyLogComponent } from './patient-daily-log.component';

describe('PatientDailyLogComponent', () => {
  let component: PatientDailyLogComponent;
  let fixture: ComponentFixture<PatientDailyLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientDailyLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDailyLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
