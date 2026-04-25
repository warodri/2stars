import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenChatMobile } from './screen-chat-mobile';

describe('ScreenChatMobile', () => {
  let component: ScreenChatMobile;
  let fixture: ComponentFixture<ScreenChatMobile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenChatMobile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenChatMobile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
