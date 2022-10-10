import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user';
import { UserService } from 'src/app/auth/user.service';
import { Post } from '../post/post';
import { PostService } from '../post/post.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  postList: Post[] = [];
  postListKeys: string[] = [];
  // posts: { [key: string]: Post } = {};
  private postSubscription?: Subscription;
  private loadAtPercent: number = 0.9;
  private static postsToLoadAfterScroll = 3;
  loadedPosts = 3;
  loadingBuffer?: NodeJS.Timeout = undefined;
  nothingLoaded = false;

  constructor(private postService: PostService, private userService: UserService) { }

  ngOnInit(): void {
    // this.posts = this.postService.getPostAll();
    this.postService.getPostAll(this.loadedPosts);
    this.postSubscription = this.postService.postListSub.subscribe((posts) => {
      Object.keys(posts).forEach(key => {
        if (!this.postListKeys.includes(key)) {
          this.postListKeys.push(key);
          this.postList.push(posts[key]);
        }
      });
      this.nothingLoaded = this.loadedPosts === this.postList.length;
      this.loadedPosts = this.postList.length;
      // this.posts = posts;
    });
  }
  ngOnDestroy(): void {
    this.postSubscription?.unsubscribe();
  }
  getUser(): User | undefined {
    return this.userService.user;
  }
  @HostListener('window:scroll', ['$event'])
  scrollHandler(event: Event) {
    const scroll = window.scrollY / (document.body.scrollHeight - document.body.offsetHeight);
    if (scroll > this.loadAtPercent) {
      if (!this.loadingBuffer) {
        this.loadingBuffer = setTimeout(() => {
          this.postService.getPostAll(this.loadedPosts + PostListComponent.postsToLoadAfterScroll);
          this.loadingBuffer = undefined;
          this.scrollHandler(event);
        }, 500);
      }
    }
  }

}
