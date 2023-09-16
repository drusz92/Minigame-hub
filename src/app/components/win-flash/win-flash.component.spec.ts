import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinFlashComponent } from './win-flash.component';

describe('WinFlashComponent', () => {
  let component: WinFlashComponent;
  let fixture: ComponentFixture<WinFlashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WinFlashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinFlashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
