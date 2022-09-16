import { PostImage } from "./post-image";
import { Comment } from "../../post-detail/comment/comment";
import { Subreddit } from "../subreddit";
import { User } from "src/app/auth/user";
import * as uuid from 'uuid';
import { DatabaseService } from "src/app/shared/database.service";
import { lastValueFrom, Observable } from "rxjs";

export class Post {

  public static PLACEHOLDER_SUBREDDIT: string = 'r/Reddit';
  public static PLACEHOLDER_USERNAME: string = 'u/username';
  public static PLACEHOLDER_TIME_CREATED: string = 'now';

  public images: PostImage[] | undefined;
  public votes: { [key: string]: Vote };
  public id: string;
  public titleUrl: string = '';
  public timeCreated?: Date;
  public timeCreatedString: string = '';
  public comments: Comment[] = [];
  public subreddit?: Subreddit;
  public subredditName: string = '';
  public author?: User;
  public authorName: string = '';

  constructor(
    subreddit: Subreddit | string,
    author: User | string,
    public title: string,
    public text?: string,
    optional?: { images?: PostImage[], titleUrl?: string, id?: string, timeCreated?: Date }) {
    if (typeof author == 'string') {
      this.authorName = author;
    } else {
      this.author = author;
      this.authorName = author.name;
    }
    if (typeof subreddit == 'string') {
      this.subredditName = subreddit;
    } else {
      this.subreddit = subreddit;
      this.subredditName = subreddit.name;
    }
    this.images = optional && optional.images ? optional.images : [];
    this.votes = {};
    if (!optional?.id) {
      this.id = this.generateId();
    } else {
      this.id = optional.id;
    }
    if (!optional?.timeCreated) {
      this.timeCreated = new Date();
    } else {
      this.timeCreated = new Date(optional.timeCreated);
    }
    this.timeCreatedString = this.timeCreated.toISOString();
    if (!optional?.titleUrl) {
      this.generateTitleUrl();
    } else {
      this.titleUrl = optional.titleUrl;
    }
  }

  static addComment(post: Post, comment: Comment) {
    post.comments.push(comment);
  }

  generateId(): string {
    const id = uuid.v4();
    return id.slice(0, 8);
  }
  generateTitleUrl(): void {
    this.titleUrl = this.title.replace(new RegExp('[\n\t /\\-,\.\?!]', 'gm'), '_');
  }
  static getUuser(author: User | string) {
    if (typeof author == 'string') {
      return User.usernameWithPrefix(author);
    }
    if (author as User) {
      return User.usernameWithPrefix((<User>author).name);
    }
    console.error(`Unexpected user value: ${author}`);
    return '';
  }
  static getRsubreddit(subreddit: Subreddit | string) {
    if (typeof subreddit == 'string') {
      return Subreddit.subredditWithPrefix(subreddit);
    }
    if (subreddit as Subreddit) {
      return (<Subreddit>subreddit).rname;
    }
    console.error(`Unexpected user value: ${subreddit}`);
    return '';
  }
  get url() {
    return this.id + '/' + this.titleUrl;
  }
  static loadObjects(
    dbService: DatabaseService,
    post: Post)
    : Promise<Post> {
    const promise = new Promise<Post>(async (resolve, reject) => {
      if (!post.subreddit && post.subredditName) {
        post.subreddit = new Subreddit(post.subredditName);
      }
      if (!post.author && post.authorName) {
        const author = await lastValueFrom(dbService.getUserByUsername(post.authorName));
        if (author) {
          post.author = author;
        }
      }
      if (!post.timeCreated && post.timeCreatedString) {
        post.timeCreated = new Date(post.timeCreatedString);
      }
      resolve(post);
    });
    return promise;
  }
  loadObjects(dbService: DatabaseService): Promise<Post> {
    return Post.loadObjects(dbService, this);
    // const promise = new Promise<Post>(async (resolve, reject) => {
    //   const result = await Post.loadObjects(dbService, {
    //     subreddit: this.subredditName, 
    //     author: this.authorName, 
    //     timeCreated: this.timeCreatedString
    //   });
    //   this.subreddit = result.subreddit;
    //   this.author = result.author;
    //   this.timeCreated = result.timeCreated;
    //   resolve(this);
    // });
    // return promise;
    // const promise = new Promise<Post>(async (resolve, reject) => {
    //   if (!this.subreddit) {
    //     this.subreddit = new Subreddit(this.subredditName);
    //   }
    //   if (!this.author) {
    //     const author = await lastValueFrom(dbService.getUserByUsername(this.authorName));
    //     if (author) {
    //       this.author = author;
    //     }
    //   }
    //   if (!this.timeCreated) {
    //     this.timeCreated = new Date(this.timeCreatedString);
    //   }
    //   resolve(this);
    // });
    // return promise;
  }
  unloadObjects(): void {
    if (!this.subredditName && this.subreddit) {
      this.subredditName = this.subreddit.name;
    }
    this.subreddit = undefined;

    if (!this.authorName && this.author) {
      this.authorName = this.author.name;
    }
    this.author = undefined;

    if (!this.timeCreatedString && this.timeCreated) {
      this.timeCreatedString = this.timeCreated.toISOString();
    }
    this.timeCreated = undefined;
  }
  static clone(original: Post): Post {
    // if ((!original.subreddit && !original.subredditName)
    //   && (!original.author && !original.authorName)
    //   && (!original.timeCreated && !original.timeCreatedString)) {
    //   console.error('Unable to clone. Missing fields.');
    //   return undefined;
    // }
    const result = new Post(
      original.subreddit ? original.subreddit : original.subredditName,
      original.author ? original.author : original.authorName,
      original.title,
      original.text,
      {
        images: original.images,
        titleUrl: original.titleUrl ? original.titleUrl : undefined,
        id: original.id ? original.id : undefined,
        timeCreated: original.timeCreated ? original.timeCreated : undefined
      }
    );
    return result;
    // const promise = new Promise<Post>(async (resolve, reject) => {
    //   const loaded = await Post.loadObjects(dbService, original);
    //   const result = new Post(
    //     loaded.subreddit ? loaded.subreddit : loaded.subredditName,
    //     loaded.author ? loaded.author : loaded.authorName,
    //     loaded.title,
    //     loaded.text,
    //     {
    //       images: loaded.images,
    //       titleUrl: loaded.titleUrl ? loaded.titleUrl : undefined,
    //       id: loaded.id ? loaded.id : undefined,
    //       timeCreated: loaded.timeCreated ? loaded.timeCreated : undefined
    //     }
    //   );
    //   resolve(result);
    // });
    // return promise;
  }
}
export class PostRest {
  public images: PostImage[] | undefined;

  constructor(
    public subreddit: string,
    public author: string,
    public title: string,
    public id: string,
    public titleUrl: string,
    public upvotes: number,
    public downvotes: number,
    public comments: Comment[],
    public text?: string,
    optional?: { images?: PostImage[] }) {
    this.upvotes = 0;
    this.downvotes = 0;
  }
}
export enum Vote {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
  NOT_VOTED = 'not_voted'
}