import { PostImage } from './post-image';
import { Comment } from '../../post-detail/comment/comment';
import { Subreddit } from '../subreddit';
import { User } from 'src/app/auth/user';
import * as uuid from 'uuid';
import { DatabaseService } from 'src/app/shared/database.service';
import { lastValueFrom, Observable } from 'rxjs';
import { IComment, IPost, IPostImage, Model } from 'src/app/model/model';

export class Post implements Model<Post, IPost> {
  public static PLACEHOLDER_SUBREDDIT: string = 'r/Reddit';
  public static PLACEHOLDER_USERNAME: string = 'u/username';
  public static PLACEHOLDER_TIME_CREATED: string = 'now';

  public images: PostImage[];
  public upvotes: number;
  public downvotes: number;
  public votes: { [key: string]: Vote };
  public id: string;
  public text: string;
  // public title: string;
  public titleUrl: string = '';
  public timeCreated: Date;
  public timeCreatedString: string = '';
  public comments: Comment[] = [];
  // public subreddit?: Subreddit;
  public subredditName: string = '';
  // public author?: User;
  public authorName: string = '';

  constructor(
    public subreddit: Subreddit,
    public author: User,
    public title: string,
    text?: string,
    optional?: {
      images?: PostImage[];
      titleUrl?: string;
      id?: string;
      timeCreated?: Date;
      upvotes?: number;
      downvotes?: number;
      votes?: { [key: string]: Vote };
      comments?: Comment[];
    }
  ) {
    // if (typeof author == 'string') {
    //   this.authorName = author;
    // } else {
    //   this.author = author;
    //   this.authorName = author.name;
    // }
    // if (typeof subreddit == 'string') {
    //   this.subredditName = subreddit;
    // } else {
    //   this.subreddit = subreddit;
    //   this.subredditName = subreddit.name;
    // }
    // this.title = title ?? '';
    this.text = text ?? '';
    this.images = optional && optional.images ? optional.images : [];
    this.upvotes = (optional && optional.upvotes) ?? 0;
    this.downvotes = (optional && optional.downvotes) ?? 0;
    this.votes = (optional && optional.votes) ?? {};
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
    this.titleUrl = this.title.replace(
      new RegExp('[\n\t /\\-,.?!]', 'gm'),
      '_'
    );
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
  // static loadObjects(dbService: DatabaseService, post: Post): Promise<Post> {
  //   const promise = new Promise<Post>(async (resolve, reject) => {
  //     if (!post.subreddit && post.subredditName) {
  //       post.subreddit = new Subreddit(post.subredditName);
  //     }
  //     if (!post.author && post.authorName) {
  //       const author = await lastValueFrom(
  //         dbService.getUserByUsername(post.authorName)
  //       );
  //       if (author) {
  //         post.author = author;
  //       }
  //     }
  //     if (!post.timeCreated && post.timeCreatedString) {
  //       post.timeCreated = new Date(post.timeCreatedString);
  //     }
  //     resolve(post);
  //   });
  //   return promise;
  // }
  // loadObjects(dbService: DatabaseService): Promise<Post> {
  //   return Post.loadObjects(dbService, this);
  //   // const promise = new Promise<Post>(async (resolve, reject) => {
  //   //   const result = await Post.loadObjects(dbService, {
  //   //     subreddit: this.subredditName,
  //   //     author: this.authorName,
  //   //     timeCreated: this.timeCreatedString
  //   //   });
  //   //   this.subreddit = result.subreddit;
  //   //   this.author = result.author;
  //   //   this.timeCreated = result.timeCreated;
  //   //   resolve(this);
  //   // });
  //   // return promise;
  //   // const promise = new Promise<Post>(async (resolve, reject) => {
  //   //   if (!this.subreddit) {
  //   //     this.subreddit = new Subreddit(this.subredditName);
  //   //   }
  //   //   if (!this.author) {
  //   //     const author = await lastValueFrom(dbService.getUserByUsername(this.authorName));
  //   //     if (author) {
  //   //       this.author = author;
  //   //     }
  //   //   }
  //   //   if (!this.timeCreated) {
  //   //     this.timeCreated = new Date(this.timeCreatedString);
  //   //   }
  //   //   resolve(this);
  //   // });
  //   // return promise;
  // }
  // unloadObjects(): void {
  //   if (!this.subredditName && this.subreddit) {
  //     this.subredditName = this.subreddit.name;
  //   }
  //   this.subreddit = undefined;

  //   if (!this.authorName && this.author) {
  //     this.authorName = this.author.name;
  //   }
  //   this.author = undefined;

  //   if (!this.timeCreatedString && this.timeCreated) {
  //     this.timeCreatedString = this.timeCreated.toISOString();
  //   }
  //   this.timeCreated = undefined;
  // }
  getPrimaryKey(): string {
    return `${this.id}_${this.titleUrl}`;
  }
  isSame(otherPost: Post): boolean {
    return this.id === otherPost.id && this.titleUrl === otherPost.titleUrl;
  }
  static clone(original: Post): Post {
    // if ((!original.subreddit && !original.subredditName)
    //   && (!original.author && !original.authorName)
    //   && (!original.timeCreated && !original.timeCreatedString)) {
    //   console.error('Unable to clone. Missing fields.');
    //   return undefined;
    // }
    // console.log(original);
    try {
      const result = new Post(
        original.subreddit ?? original.subredditName,
        original.author ?? original.authorName,
        original.title,
        original.text,
        {
          images: original.images,
          titleUrl: original.titleUrl ?? undefined,
          id: original.id ?? undefined,
          timeCreated:
            original.timeCreated ?? original.timeCreatedString
              ? new Date(original.timeCreatedString)
              : undefined,
          upvotes: original.upvotes ?? 0,
          downvotes: original.downvotes ?? 0,
          votes: original.votes ?? {},
        }
      );
      return result;
    } catch (error) {
      console.error(`Post has incorrect format: ${JSON.stringify(original)}`);
      throw error;
    }
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
  from(intface: IPost, dbService: DatabaseService): Promise<Post> {
    // console.log(`From post: ${JSON.stringify(intface)}`);
    return new Promise(async (resolve, reject) => {
      const subreddit = new Subreddit(intface.subreddit);

      const author = await lastValueFrom(dbService.getUserById(intface.user));
      if (!author) {
        reject('Author was not found');
        return;
      }
      const timeCreated = new Date(intface.timeCreated);
      const images = intface.images
        ? intface.images.map((i) => new PostImage(i.url, i.title))
        : [];
      const post = new Post(subreddit, author, intface.title, intface.text, {
        images: images,
        upvotes: intface.upvotes,
        downvotes: intface.downvotes,
        votes: intface.votes,
        id: intface.id,
        titleUrl: intface.titleUrl,
        timeCreated: timeCreated,
      });
      // if (!!loadComments && loadComments) {
      //   const comments: Comment[] = [];
      //   if (!!intface.comments) {
      //     for (const comment of intface.comments) {
      //       const author = await lastValueFrom(
      //         dbService.getUserByUsername(comment.user)
      //       );
      //       if (!author) {
      //         reject('Author of comment was not found');
      //         return;
      //       }
      //       const commentModel = new Comment(
      //         post,
      //         author,
      //         comment.text,
      //         undefined
      //       );
      //       comments.push(commentModel);
      //     }
      //   }
      //   post.comments = comments;
      // }
      resolve(post);
    });
  }
  toInterface(): IPost {
    const images: IPostImage[] = [];
    images.push(
      ...this.images.map<IPostImage>((i) => ({ url: i.url, title: i.title }))
    );
    const comments: IComment[] = [];
    comments.push(
      ...this.comments.map<IComment>((c) => ({
        user: c.author?.id,
        text: c.text,
      }))
    );
    return {
      images: images,
      upvotes: this.upvotes,
      downvotes: this.downvotes,
      votes: this.votes,
      id: this.id,
      title: this.title,
      titleUrl: this.titleUrl,
      text: this.text,
      timeCreated: this.timeCreated.toISOString(),
      comments: comments,
      subreddit: this.subreddit.name,
      user: this.author.id,
    };
  }
  emptyModel(): Post {
    return Post.emptyModel();
  }
  static emptyModel(): Post {
    return new Post(
      new Subreddit(''),
      new User('', '', '', '', 0, new Date()),
      '',
      ''
    );
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
    optional?: { images?: PostImage[] }
  ) {
    this.upvotes = 0;
    this.downvotes = 0;
  }
}
export enum Vote {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
  NOT_VOTED = 'not_voted',
}
