import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCreateSimpleComponent } from './post-create-simple.component';

describe('PostCreateSimpleComponent', () => {
  let component: PostCreateSimpleComponent;
  let fixture: ComponentFixture<PostCreateSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostCreateSimpleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCreateSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
