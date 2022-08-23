import { User } from "src/app/user";
import { Post } from "./post";

export class Comment {
  public answers: Comment[] = [];

  constructor(
    private _post: Post,
    private _author: User,
    public text: string,
    private _parentComment?: Comment
  ) {
  }

  get post(): Post { return this._post; }
  get author(): User { return this._author; }
  get parentComment(): Comment | undefined { return this._parentComment; }
}