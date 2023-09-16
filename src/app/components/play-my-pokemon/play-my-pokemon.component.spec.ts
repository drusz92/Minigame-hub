import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayMyPokemonComponent } from './play-my-pokemon.component';

describe('PlayMyPokemonComponent', () => {
  let component: PlayMyPokemonComponent;
  let fixture: ComponentFixture<PlayMyPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayMyPokemonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayMyPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
