import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymListComponent } from './gym-list.component';

describe('GameListComponent', () => {
  let component: GymListComponent;
  let fixture: ComponentFixture<GymListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GymListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GymListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
