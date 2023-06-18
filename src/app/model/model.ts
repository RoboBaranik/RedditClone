import { User } from '../auth/user';
import { DatabaseService } from '../shared/database.service';
import { Vote } from '../subreddit/post/post';

export interface IPost {
  images: IPostImage[] | undefined;
  upvotes: number;
  downvotes: number;
  votes: { [key: string]: Vote };
  id: string;
  title: string;
  titleUrl: string;
  text: string;
  timeCreated: string;
  comments: IComment[] | undefined;
  subreddit: string;
  user: string;
}
export interface IPostImage {
  url: string;
  title: string;
}
export interface IComment {
  user?: string;
  text: string;
  // parentComment: IComment | undefined;
  // answers: IComment[] | undefined;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  karma: number;
  lastLogin: string;
}
export enum DbObject {
  USER = 'users',
  POST = 'posts',
}
// export interface Intface<M extends Model<any, any>> {
//   toModel(): M;
// }
export interface Model<M, I> {
  from(intface: I, dbService: DatabaseService): Promise<M>;
  toInterface(): I;
  // loadData(dbService: DatabaseService): Promise<M>;
  emptyModel(): M;
}
