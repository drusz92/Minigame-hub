import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayRightBoxComponent } from './play-right-box.component';

describe('PlayRightBoxComponent', () => {
  let component: PlayRightBoxComponent;
  let fixture: ComponentFixture<PlayRightBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayRightBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayRightBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
