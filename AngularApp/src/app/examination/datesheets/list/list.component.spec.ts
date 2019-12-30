import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDateSheetComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListDateSheetComponent;
  let fixture: ComponentFixture<ListDateSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDateSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDateSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
