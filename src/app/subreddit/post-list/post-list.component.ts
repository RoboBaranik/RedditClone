import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user';
import { UserService } from 'src/app/auth/user.service';
import { Post } from '../post/post';
import { PostService } from '../post/post.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postSubscription?: Subscription;

  constructor(private postService: PostService, private userService: UserService) { }

  ngOnInit(): void {
    // this.posts = this.postService.getPostAll();
    this.postService.getPostAll();
    this.postSubscription = this.postService.postListSub.subscribe((posts) => {
      this.posts = posts;
    });
  }
  ngOnDestroy(): void {
    this.postSubscription?.unsubscribe();
  }
  getUser(): User | undefined {
    return this.userService.user;
  }

}
