import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesPanel } from './messages-panel';

describe('MessagesPanel', () => {
  let component: MessagesPanel;
  let fixture: ComponentFixture<MessagesPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessagesPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
