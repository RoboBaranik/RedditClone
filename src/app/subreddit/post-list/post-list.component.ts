import { Component, OnInit } from '@angular/core';
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
export class PostListComponent implements OnInit {

  posts: Post[] = [];

  constructor(private postService: PostService, private userService: UserService) { }

  ngOnInit(): void {
    this.posts = this.postService.getPostAll();
    this.postService.postListSub.subscribe((posts) => {
      this.posts = posts;
    });
  }
  getUser(): User | undefined {
    return this.userService.user;
  }

}
