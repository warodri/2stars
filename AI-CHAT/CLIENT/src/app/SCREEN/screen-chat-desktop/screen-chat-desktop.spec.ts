import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenChatDesktop } from './screen-chat-desktop';

describe('ScreenChatDesktop', () => {
  let component: ScreenChatDesktop;
  let fixture: ComponentFixture<ScreenChatDesktop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenChatDesktop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenChatDesktop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
