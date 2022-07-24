import { PostImage } from "./post-image";

export class Post {

  public upvotes: number;
  public downvotes: number;

  constructor(public title: string, public text: string, public images?: PostImage[]) {
    this.upvotes = 0;
    this.downvotes = 0;
  }
}