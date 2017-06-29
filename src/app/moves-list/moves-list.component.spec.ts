import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovesListComponent } from './moves-list.component';

describe('MovesListComponent', () => {
  let component: MovesListComponent;
  let fixture: ComponentFixture<MovesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
