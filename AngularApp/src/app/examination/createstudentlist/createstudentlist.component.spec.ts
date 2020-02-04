import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatestudentlistComponent } from './createstudentlist.component';

describe('CreatestudentlistComponent', () => {
  let component: CreatestudentlistComponent;
  let fixture: ComponentFixture<CreatestudentlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatestudentlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatestudentlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
