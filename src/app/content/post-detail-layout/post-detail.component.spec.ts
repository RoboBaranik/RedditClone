import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDetailLayoutComponent } from './post-detail-layout.component';

describe('ContentComponent', () => {
  let component: PostDetailLayoutComponent;
  let fixture: ComponentFixture<PostDetailLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostDetailLayoutComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDetailLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
