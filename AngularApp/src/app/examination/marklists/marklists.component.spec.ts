import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarklistsComponent } from './marklists.component';

describe('MarklistsComponent', () => {
  let component: MarklistsComponent;
  let fixture: ComponentFixture<MarklistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarklistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarklistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
