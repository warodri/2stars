import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenMain } from './screen-main';

describe('ScreenMain', () => {
  let component: ScreenMain;
  let fixture: ComponentFixture<ScreenMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
