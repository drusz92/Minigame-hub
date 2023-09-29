import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymBattleComponent } from './gym-battle.component';

describe('GymBattleComponent', () => {
  let component: GymBattleComponent;
  let fixture: ComponentFixture<GymBattleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GymBattleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GymBattleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
