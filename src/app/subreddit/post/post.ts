import { PostImage } from "./post-image";
import { Comment } from "../../post-detail/comment/comment";
import { Subreddit } from "../subreddit";
import { User } from "src/app/auth/user";
import * as uuid from 'uuid';

export class Post {

  public images: PostImage[] | undefined;
  public upvotes: number;
  public downvotes: number;
  public id: string;
  public titleUrl: string = '';
  public timeCreated: Date;
  public comments: Comment[] = [];

  constructor(
    public subreddit: Subreddit | string,
    public author: User | string,
    public title: string,
    public text?: string,
    optional?: { images?: PostImage[], titleUrl?: string, id?: string, timeCreated?: Date }) {
    this.images = optional?.images;
    this.upvotes = 0;
    this.downvotes = 0;
    if (!optional?.id) {
      this.id = this.generateId();
    } else {
      this.id = optional.id;
    }
    if (!optional?.timeCreated) {
      this.timeCreated = new Date();
    } else {
      this.timeCreated = optional.timeCreated;
    }
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