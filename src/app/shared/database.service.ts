import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, mergeMap, Observable, of, tap } from "rxjs";
import { User } from "../auth/user";
import { Post } from "../subreddit/post/post";
import { Subreddit } from "../subreddit/subreddit";
import * as uuid from 'uuid';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  constructor(private http: HttpClient) {
  }
  private _dbUrl: string = 'https://redditclone-e791d-default-rtdb.europe-west1.firebasedatabase.app/';
  createUser(user: User): Observable<User> {
    return this.http.put<User>(`${this._dbUrl}users/${user.id}.json`, user);
  }
  getUserByUsername(name: string): Observable<User | undefined> {
    return this.http.get<{ [key: string]: User }>(`${this._dbUrl}users.json`,
      {
        params: new HttpParams()
          .append('orderBy', '"name"')
          .append('equalTo', `"${name}"`)
      }).pipe(map(user => {
        const foundUsers = Object.values(user);
        if (!foundUsers) {
          return undefined;
        }
        if (foundUsers.length > 1) {
          console.error(`More then one user with name ${name}`);
        }
        return foundUsers[0];
      }));
  }
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this._dbUrl}users/${id}.json`);
  }
  createPost(post: Post): Observable<Post | undefined> {
    const postClone = Object.assign({}, post);
    const subreddit = postClone.subreddit as Subreddit;
    if (subreddit) {
      postClone.subreddit = subreddit.name;
    }
    const user = postClone.author as User;
    if (user) {
      postClone.author = user.name;
    }
    console.log(postClone);
    return this.getPostById(postClone).pipe(mergeMap(postFound => {
      if (!postFound) {
        return this.http.put<Post>(`${this._dbUrl}posts/${postClone.id}_${postClone.titleUrl}.json`, postClone);
      }
      post.id = post.generateId();
      post.titleUrl = post.titleUrl + post.generateId();
      return this.createPost(post);
    }
    ));
    // return this.http.put<Post>(`${this._dbUrl}posts/${post.id}_${post.titleUrl}.json`, post);
  }
  getPostById(post: Post) {
    return this.http.get<Post>(`${this._dbUrl}posts/${post.id}_${post.titleUrl}.json`);
  }
  getPostAll(limit?: number): Observable<Post[]> {
    const params = new HttpParams();
    if (limit && limit > 0) {
      params.append('orderBy', '"$value"').append('limitToFirst', `"${limit}"`);
    }

    return this.http.get<{ [key: string]: Post }>(`${this._dbUrl}posts.json`,
      {
        params: params
      }).pipe(map(posts => {
        const postList = Object.values(posts);
        postList.forEach(post => {
          if (typeof post.subreddit == 'string') {
            post.subreddit = new Subreddit(post.subreddit, '');
          }
          // console.log(`Author: ${post.author}`);
          if (typeof post.author == 'string') {
            this.getUserByUsername(post.author).subscribe(author => {
              if (author) {
                post.author = author;
              }
            })
          }
        });
        return postList;
      }), tap(posts => console.log(posts)));
  }
}