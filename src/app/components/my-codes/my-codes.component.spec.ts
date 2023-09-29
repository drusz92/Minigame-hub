import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCodesComponent } from './my-codes.component';

describe('MyCodesComponent', () => {
  let component: MyCodesComponent;
  let fixture: ComponentFixture<MyCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
