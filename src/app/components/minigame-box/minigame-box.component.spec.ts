import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinigameBoxComponent } from './minigame-box.component';

describe('MinigameBoxComponent', () => {
  let component: MinigameBoxComponent;
  let fixture: ComponentFixture<MinigameBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinigameBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinigameBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
