import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Post, Vote } from './post';
import { PostService } from './post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {

  @Input() post!: Post;
  voteTypes = Vote;
  vote: Vote = Vote.NOT_VOTED;
  voteNumber: string = 'Vote';
  refreshInterval?: NodeJS.Timeout;
  private static POST_REFRESH_RATE = 10000;

  private ignoreOnClickElements: string[] = ['mat-icon', 'button', 'a'];
  private mousePosition: { x: number, y: number } = {
    x: 0,
    y: 0
  };

  constructor(private router: Router, private postService: PostService) {
  }

  ngOnInit(): void {
    if (this.post) {
      this.refreshPost(this.post.id, this.post.titleUrl);
      this.refreshInterval = setInterval(() => {
        console.log('Refreshing ... ' + this.post.titleUrl);
        this.refreshPost(this.post.id, this.post.titleUrl);
      }, PostComponent.POST_REFRESH_RATE);
    }
  }
  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
  refreshPost(postId: string, titleUrl: string): void {
    const sub = this.postService.getPost(postId, titleUrl).subscribe(post => {
      if (post) {
        this.post = post;
        this.voteNumber = this.postService.getNumberOfUpvotes(post);
        const vote = this.postService.getVote(post);
        if (vote) {
          this.vote = vote;
        }
      }
    });
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
  onUpvote(): void {
    this.onVote(Vote.UPVOTE);
  }
  onDownvote(): void {
    this.onVote(Vote.DOWNVOTE);
  }
  private onVote(voteAction: Vote): void {
    if (!this.post) { return; }
    const voteState = this.postService.getNewVoteState(this.vote, voteAction);
    this.vote = voteState.newVote;
    this.post.upvotes += voteState.upvoteDiff;
    this.post.downvotes += voteState.downvoteDiff;
    this.voteNumber = this.postService.getNumberOfUpvotes(this.post);
    this.postService.votePost(this.post, this.vote);
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
  getTimeCreated(): string {
    if (this.post) {
      if (this.post.timeCreated) {
        return this.post.timeCreated.toISOString();
      }
      if (this.post.timeCreatedString) {
        return this.post.timeCreatedString;
      }
    }
    return Post.PLACEHOLDER_TIME_CREATED;
  }

}
