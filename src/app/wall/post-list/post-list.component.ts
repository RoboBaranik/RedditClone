import { Component, OnInit } from '@angular/core';
import { Post } from './post/post';
import { PostService } from './post/post.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts: Post[] = [];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.posts = this.postService.getPostAll();
    this.postService.postListSub.subscribe((posts) => {
      this.posts = posts;
    });
  }

}
