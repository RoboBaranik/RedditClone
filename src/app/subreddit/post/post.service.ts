import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from 'src/app/auth/user';
import { DatabaseService } from 'src/app/shared/database.service';
import { UserService } from '../../auth/user.service';
import { Comment } from '../../post-detail/comment/comment';
import { Subreddit } from '../subreddit';
import { Post, Vote } from './post';
import { PostImage } from './post-image';

@Injectable({ providedIn: 'root' })
export class PostService {
  postList: { [key: string]: Post } = {};
  postListSub: BehaviorSubject<{ [key: string]: Post }> = new BehaviorSubject<{
    [key: string]: Post;
  }>({});

  constructor(
    private userService: UserService,
    private dbService: DatabaseService,
    private http: HttpClient
  ) {
    /*this.postList.push(
      new Post('r/Reddit', 'u/redditor', 'A nice title for a post', 'This is a description of a post. Should be clear enough. :)'),
      new Post('r/leagueoflegends', 'u/someone', 'Hmm, what is this?', '', { images: [new PostImage('https://i.redd.it/i43jvn2ymjj91.jpg', 'What')] }),
      new Post('r/Important', 'u/yasuoplayer', 'What?', 'Ahh yes, I almost forgot. This is really important description of my post. Never delete it. Please :)'),
      new Post('r/Test', 'u/loremipsumman', 'A loong post', `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vehicula venenatis erat, rutrum consequat dolor bibendum et. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce interdum erat at odio bibendum fringilla. Mauris suscipit lacinia turpis, sit amet porttitor felis semper sed. Cras fringilla vulputate ultrices. Cras ac viverra mauris. Donec a tincidunt nulla, vel mattis enim.
      
      Morbi ultricies facilisis eros at mattis. Praesent quis nibh odio. Phasellus eget imperdiet nunc, id egestas enim. Praesent in massa scelerisque, finibus risus eu, pharetra turpis. Curabitur laoreet euismod lorem nec luctus. Proin vitae mauris diam. Morbi a fermentum lorem, sed suscipit massa. Vestibulum interdum placerat purus, ut auctor ex congue sed.
      
      Vestibulum lobortis vel eros eu fringilla. Ut quis facilisis nunc. Nunc pellentesque enim eget tristique finibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc semper euismod massa at pulvinar. Nunc lobortis lorem sed posuere laoreet. Aenean a arcu eu ante ornare dapibus. Phasellus a tortor ut velit blandit ultrices ac in leo. Quisque id elit ullamcorper, feugiat tortor eget, ultricies lorem. Mauris lacinia massa a lacus semper venenatis. Donec mattis, erat eu congue tempor, tellus ex sagittis augue, eget efficitur urna nulla vitae felis. Donec lectus arcu, tempus quis blandit vitae, volutpat vel lorem.
      
      Nulla hendrerit leo id lobortis varius. Proin nec tempus ex. Morbi aliquet accumsan tortor nec venenatis. Pellentesque blandit ac sem vel sodales. Vivamus vitae lorem non risus efficitur placerat sit amet vel lectus. Aenean consequat, purus in commodo lobortis, lectus purus eleifend lorem, id placerat quam eros ut augue. Phasellus et libero in dui ultricies pellentesque. Sed et volutpat sem. Etiam elementum sagittis lacus, at sollicitudin massa vehicula vel. Donec rutrum suscipit magna, sit amet scelerisque neque gravida eget. Mauris in pellentesque dolor. Aliquam viverra, urna nec sodales elementum, sem leo ullamcorper libero, sit amet congue leo metus vel orci. Integer sodales elit et placerat sagittis. Quisque volutpat magna non nibh fringilla dapibus.
      
      Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce molestie, sem volutpat sagittis rhoncus, lorem ipsum vehicula eros, vitae commodo dui turpis ac nisi. Donec non commodo tellus. Aenean luctus urna vitae aliquet semper. Quisque sit amet arcu posuere, sollicitudin quam ut, aliquet mauris. Sed pulvinar purus odio, a maximus quam gravida eu. Nunc in eros nec ante tempor semper. Donec sit amet ultrices velit. Donec sed lectus nec ligula sollicitudin gravida ac in lectus. Ut et elementum sapien. Nulla rhoncus lacinia urna at placerat. Integer felis ipsum, pharetra sed metus id, pretium malesuada tortor. Suspendisse sapien nulla, sollicitudin eu dolor a, vehicula fringilla metus. Donec auctor, tellus ac vulputate dapibus, nibh diam ultrices lorem, at placerat leo velit molestie diam.`),
      new Post('r/Empty', 'u/voda', 'Post with no text')
    );*/
  }

  createPost(title: string, text?: string, images?: PostImage[]): Post {
    if (!this.userService.user) {
      throw new Error('Please log in!');
    }
    var newPost = new Post(
      new Subreddit('Reddit'),
      this.userService.user,
      title,
      text,
      { images: images }
    );
    this.dbService.createPost(newPost).subscribe({
      next: (post) => console.log(post),
      error: (error) => console.error(error),
    });
    // this.postList.push(newPost);
    // this.postListSub.next(this.postList);
    return newPost;
  }
  getPostByListIndex(id: number) {
    return this.postList[id];
  }
  getPost(postId: string, postTitleUrl: string) {
    return this.dbService.getPostById(postId, postTitleUrl);
    // return this.postList.find(post => post.id === postId && post.titleUrl.localeCompare(postTitleUrl) === 0);
  }
  getPostAll(limit?: number): void {
    this.dbService
      .getPostAll(limit)
      .subscribe((posts) => this.postListSub.next(posts));
  }
  editPost(updatedPost: Post) {
    // this.postList[id] = updatedPost;
    this.dbService.updatePost(updatedPost).subscribe((post) => {
      if (post) {
        this.postList[post.getPrimaryKey()] = post;
        this.postListSub.next(this.postList);
        // const oldPostIndex = this.postList.findIndex(post1 => post1.isSame(post));
        // if (oldPostIndex >= 0) {
        //   this.postList[oldPostIndex] = post;
        //   this.postListSub.next(this.postList);
        // }
      } else {
        console.log(`Post update failed. Post ${updatedPost.author}`);
      }
    });
  }
  deletePost(post: Post) {
    delete this.postList[post.getPrimaryKey()];
    // this.postList.splice(id, 1);
    this.postListSub.next(this.postList);
  }

  // Post updates

  addComment(post: Post, comment: Comment) {
    const user = this.userService.user;
    if (user) {
      const clone = Post.clone(post);
      Post.addComment(clone, comment);
      this.editPost(clone);
    } else {
      console.error('Not logged in.');
    }
  }
  votePost(post: Post, vote: Vote): boolean {
    const user = this.userService.user;
    if (!user) {
      console.error('Not logged in.');
      return false;
    }
    // console.log(`Post: ${JSON.stringify(post)}`);

    const clone = Post.clone(post);
    // console.log(`Clone: ${JSON.stringify(clone)}`);
    if (vote === Vote.NOT_VOTED) {
      delete clone.votes[user.id];
    } else {
      clone.votes[user.id] = vote;
    }
    // console.log(`Clone2: ${JSON.stringify(clone)}`);
    this.editPost(clone);
    // console.log(`Clone3: ${JSON.stringify(clone)}`);
    return true;
  }
  getNumberOfUpvotes(post: Post): string {
    const count = post.upvotes - post.downvotes;
    if (count === 0) {
      return '0';
    }
    const absCount = Math.abs(count);
    const divisors = [1_000_000_000, 1_000_000, 1_000, 1];
    for (let divisor of divisors) {
      if (absCount >= divisor) {
        const str = this.numberToShortString(absCount, divisor, count > 0);
        return str;
      }
    }
    return 'Vote';
  }
  numberToShortString(
    num: number,
    divisor: number,
    isPositive: boolean
  ): string {
    const countDivided = num / divisor;
    const substringLength = 100 > countDivided && countDivided >= 10 ? 4 : 3;
    const numericPart = countDivided
      .toLocaleString('en-US')
      .substring(0, substringLength);
    return `${isPositive ? '' : '-'} ${numericPart}`;
  }
  getVote(post: Post, user?: User): Vote | undefined {
    if (!user) {
      const currentUser = this.userService.user;
      if (!currentUser) {
        return undefined;
      }
      user = currentUser;
    }
    return post.votes[user.id] ?? Vote.NOT_VOTED;
  }
  getNewVoteState(oldVote: Vote, action: Vote): NewVoteState {
    if (action === Vote.NOT_VOTED) {
      return new NewVoteState(oldVote, oldVote, 0, 0);
    }
    const isActionUpvote = action === Vote.UPVOTE;
    if (action === oldVote) {
      return new NewVoteState(
        Vote.NOT_VOTED,
        oldVote,
        isActionUpvote ? -1 : 0,
        isActionUpvote ? 0 : -1
      );
    }
    if (oldVote === Vote.NOT_VOTED) {
      return new NewVoteState(
        action,
        oldVote,
        isActionUpvote ? 1 : 0,
        isActionUpvote ? 0 : 1
      );
    }
    return new NewVoteState(
      action,
      oldVote,
      isActionUpvote ? 1 : -1,
      isActionUpvote ? -1 : 1
    );
  }

  // private updatePost(post: Post, f: (halo: Post) => void) {
  //   this.getPost(post.id, post.titleUrl).subscribe(foundPost => {
  //     if (foundPost) {
  //       f(foundPost);
  //       this.postListSub.next(this.postList);
  //     }
  //   });
  // }
}
export class NewVoteState {
  constructor(
    public newVote: Vote,
    public oldVote: Vote,
    public upvoteDiff: number,
    public downvoteDiff: number
  ) {}
}
