import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import { Post } from 'src/app/subreddit/post/post';
import { PostService } from 'src/app/subreddit/post/post.service';
import { Comment } from '../comment/comment';

@Component({
  selector: 'post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {

  post!: Post;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

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
        var commentTexts = ['Test of the comments', 'Ahh, I see...', 'I did nazi that', 'Spanish inquisition', `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vehicula venenatis erat, rutrum consequat dolor bibendum et. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce interdum erat at odio bibendum fringilla. Mauris suscipit lacinia turpis, sit amet porttitor felis semper sed. Cras fringilla vulputate ultrices. Cras ac viverra mauris. Donec a tincidunt nulla, vel mattis enim.`];
        this.mockComments(this.post, commentTexts);
        // this.postService.addComment(this.post, new Comment(this.post, new User('u/commenternumber1', 'abc', '', 0), 'Test of the comments'));
      }
    })
  }

  mockComments(post: Post, commentTexts: string[]): void {
    console.log(`Texts: ${commentTexts.length}. Users: ${this.userService.getNumberOfMockUsers()}`);
    for (var index = 0; index < commentTexts.length && index < this.userService.getNumberOfMockUsers(); index++) {
      var user = this.userService.getUserByMockId(index);
      if (!user) continue;
      var comment = new Comment(post, user, commentTexts[index]);
      if (index === 0) {
        comment.addAnswer(new Comment(post, user, 'What was here?', comment));
        comment.anononymize();
      }
      this.postService.addComment(post, comment);
    }
  }

}