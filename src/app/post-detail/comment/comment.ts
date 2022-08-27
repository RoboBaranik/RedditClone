import { User } from "src/app/auth/user";
import { Post } from "src/app/subreddit/post/post";

export class Comment {
  private _author: User | undefined;
  public answers: Comment[] = [];

  constructor(
    private _post: Post,
    author: User,
    public text: string,
    private _parentComment?: Comment
  ) {
    this._author = author;
  }

  addAnswer(answer: Comment) {
    this.answers.push(answer);
  }
  anononymize() {
    this._author = undefined;
  }

  get post(): Post { return this._post; }
  get author(): User | undefined { return this._author; }
  get parentComment(): Comment | undefined { return this._parentComment; }
}