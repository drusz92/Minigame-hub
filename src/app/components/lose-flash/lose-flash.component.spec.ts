import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoseFlashComponent } from './lose-flash.component';

describe('LoseFlashComponent', () => {
  let component: LoseFlashComponent;
  let fixture: ComponentFixture<LoseFlashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoseFlashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoseFlashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
