import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStudentsComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListStudentsComponent;
  let fixture: ComponentFixture<ListStudentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListStudentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
