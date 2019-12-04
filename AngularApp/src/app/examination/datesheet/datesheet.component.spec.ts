import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatesheetComponent } from './datesheet.component';

describe('DatesheetComponent', () => {
  let component: DatesheetComponent;
  let fixture: ComponentFixture<DatesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
