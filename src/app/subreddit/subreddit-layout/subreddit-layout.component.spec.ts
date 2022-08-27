import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubredditLayoutComponent } from './subreddit-layout.component';

describe('SubredditComponent', () => {
  let component: SubredditLayoutComponent;
  let fixture: ComponentFixture<SubredditLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubredditLayoutComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubredditLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
