import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/auth/user';
import { UserService } from 'src/app/auth/user.service';
import { Post, Vote } from 'src/app/subreddit/post/post';
import { PostService } from 'src/app/subreddit/post/post.service';
import { Subreddit } from 'src/app/subreddit/subreddit';
import { Comment } from '../comment/comment';

@Component({
  selector: 'post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, OnDestroy {

  post?: Post;
  vote: Vote = Vote.NOT_VOTED;
  voteTypes = Vote;
  voteNumber: string = 'Vote';
  refreshInterval?: NodeJS.Timeout;
  private static POST_REFRESH_RATE = 10000;
  private static PLACEHOLDER_SUBREDDIT: string = 'r/Reddit';
  private static PLACEHOLDER_USERNAME: string = 'u/username';

  constructor(
    private postService: PostService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      if (url.length < 4 || !url[2].path || !url[3].path) {
        console.error('Unexpected URL');
        return;
      }
      const postId = url[2].path;
      const titleUrl = url[3].path;
      this.refreshPost(postId, titleUrl);
      this.refreshInterval = setInterval(() => {
        console.log('Refreshing ... ' + titleUrl);
        this.refreshPost(postId, titleUrl);
      }, PostDetailComponent.POST_REFRESH_RATE);
    });
  }
  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
  refreshPost(postId: string, titleUrl: string): void {
    const sub = this.postService.getPost(postId, titleUrl).subscribe(post => {
      if (post) {
        // if (!post.comments) {
        //   post.comments = [];
        // }
        // setTimeout(() => this.post = post, 5000);
        this.post = post;
        this.voteNumber = this.postService.getNumberOfUpvotes(post);
        const vote = this.postService.getVote(post);
        if (vote) {
          this.vote = vote;
        }
        var commentTexts = ['Test of the comments', 'Ahh, I see...', 'I did nazi that', 'Spanish inquisition', `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vehicula venenatis erat, rutrum consequat dolor bibendum et. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce interdum erat at odio bibendum fringilla. Mauris suscipit lacinia turpis, sit amet porttitor felis semper sed. Cras fringilla vulputate ultrices. Cras ac viverra mauris. Donec a tincidunt nulla, vel mattis enim.`];
        // this.mockComments(this.post, commentTexts);
        // this.postService.addComment(this.post, new Comment(this.post, new User('u/commenternumber1', 'abc', '', 0), 'Test of the comments'));
      }
    });
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

  // mockComments(post: Post, commentTexts: string[]): void {
  //   console.log(`Texts: ${commentTexts.length}. Users: ${this.userService.getNumberOfMockUsers()}`);
  //   for (var index = 0; index < commentTexts.length && index < this.userService.getNumberOfMockUsers(); index++) {
  //     var user = this.userService.getUserByMockId(index);
  //     if (!user) continue;
  //     var comment = new Comment(post, user, commentTexts[index]);
  //     if (index === 0) {
  //       comment.addAnswer(new Comment(post, user, 'What was here?', comment));
  //       comment.anononymize();
  //     }
  //     this.postService.addComment(post, comment);
  //   }
  // }

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
