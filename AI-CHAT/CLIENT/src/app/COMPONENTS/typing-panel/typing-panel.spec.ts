import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypingPanel } from './typing-panel';

describe('TypingPanel', () => {
  let component: TypingPanel;
  let fixture: ComponentFixture<TypingPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypingPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypingPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
