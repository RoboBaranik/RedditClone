import { PostImage } from "./post-image";
import { Comment } from "./comment";

export class Post {

  public images: PostImage[] | undefined;
  public upvotes: number;
  public downvotes: number;
  public id: string;
  public titleUrl: string = '';
  public comments: Comment[] = [];

  constructor(
    public subreddit: string,
    public author: string,
    public title: string,
    public text?: string,
    optional?: { images?: PostImage[], titleUrl?: string }) {
    this.images = optional?.images;
    this.upvotes = 0;
    this.downvotes = 0;
    this.id = this.generateId();
    if (!optional?.titleUrl) {
      this.generateTitleUrl();
    } else {
      this.titleUrl = optional.titleUrl;
    }
  }

  addComment(comment: Comment) {
    this.comments.push(comment);
  }

  generateId(): string {
    return 'abcdef';
  }
  generateTitleUrl(): void {
    this.titleUrl = this.title.replace(new RegExp('[\n\t /\\-,\.\?!]', 'gm'), '_');
  }
  get url() {
    return this.id + '/' + this.titleUrl;
  }
}