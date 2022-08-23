import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/user';
import { Comment } from '../post-list/post/comment';
import { Post } from '../post-list/post/post';
import { PostService } from '../post-list/post/post.service';

@Component({
  selector: 'post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {

  post!: Post;

  constructor(private postService: PostService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      if (url.length < 4 || !url[2].path || !url[3].path) {
        console.error('Unexpected URL');
        return;
      }
      const postId = url[2].path;
      const titleUrl = url[3].path;
      const post = this.postService.getPost(postId, titleUrl);
      if (post) {
        this.post = post;
        this.postService.addComment(this.post, new Comment(this.post, new User('u/commenternumber1', 'abc', '', 0), 'Test of the comments'));
      }
    })
  }

}
