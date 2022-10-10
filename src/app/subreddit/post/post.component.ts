import { Component, Input, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Post } from './post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post!: Post;

  private ignoreOnClickElements: string[] = ['mat-icon', 'button', 'a'];
  private mousePosition: { x: number, y: number } = {
    x: 0,
    y: 0
  };

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  postClicked(event: MouseEvent): void {
    if (Math.abs(this.mousePosition.x - event.screenX) > 5 ||
      Math.abs(this.mousePosition.y - event.screenY) > 5) {
      return;
    }

    var elementClicked = (<HTMLElement>event.target);
    for (var i = 0; i < 3; i++) {
      if (this.ignoreOnClickElements.find(element => element === elementClicked.localName)) {
        return;
      }
      if (!elementClicked.parentElement) {
        return;
      }
      elementClicked = elementClicked.parentElement;
    }
    this.navigateToDetails();
  }
  onUpvote() {

  }
  onDownvote() {

  }
  navigateToDetails() {
    const subreddit = this.getSubredditName();
    if (subreddit) {
      this.router.navigate([subreddit, this.post.id, this.post.titleUrl]);
    }
  }

  postMouseDown(event: MouseEvent) {
    this.mousePosition.x = event.screenX;
    this.mousePosition.y = event.screenY;
  }
  getSubredditName(): string {
    if (this.post) {
      if (this.post.subreddit) {
        return Post.getRsubreddit(this.post.subreddit);
      }
      if (this.post.subredditName) {
        return Post.getRsubreddit(this.post.subredditName);
      }
    }
    return Post.PLACEHOLDER_SUBREDDIT;
  }
  getUserName(): string {
    if (this.post) {
      if (this.post.author) {
        return Post.getUuser(this.post.author);
      }
      if (this.post.subredditName) {
        return Post.getUuser(this.post.authorName);
      }
    }
    return Post.PLACEHOLDER_USERNAME;
  }

}
