import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { defer, from, map, mergeMap, Observable, of, tap } from "rxjs";
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
    return this.http.put<User>(`${this._dbUrl}users/${user.id}.json`, user).pipe(map(user => User.clone(user)));
  }
  getUserByUsername(name: string): Observable<User | undefined> {
    return this.http.get<{ [key: string]: User }>(`${this._dbUrl}users.json`,
      {
        params: new HttpParams()
          .append('orderBy', '"name"')
          .append('equalTo', `"${name}"`)
      }).pipe(map(user => {
        const foundUsers = Object.values(user);
        if (!foundUsers || !foundUsers[0]) {
          return undefined;
        }
        if (foundUsers.length > 1) {
          console.error(`More then one user with name ${name}`);
        }
        return User.clone(foundUsers[0]);
      }));
  }
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this._dbUrl}users/${id}.json`).pipe(map(user => User.clone(user)));;
  }
  createPost(post: Post): Observable<Post | undefined> {
    const postClonePromise = Post.clone(post).loadObjects(this);
    if (!postClonePromise) {
      return of(undefined);
    }
    return defer(() => from(postClonePromise).pipe(mergeMap(postClone => {
      postClone.unloadObjects();
      return this.getPostById(postClone.id, postClone.titleUrl).pipe(mergeMap(postFound => {
        if (!postFound) {
          return this.http.put<Post>(`${this._dbUrl}posts/${postClone.id}_${postClone.titleUrl}.json`, postClone)
            .pipe(mergeMap(post => {
              const clone = Post.clone(post).loadObjects(this);
              if (clone) {
                return clone;
              }
              return of(undefined);
            }));
        }
        post.id = post.generateId();
        post.titleUrl = post.titleUrl + post.generateId();
        return this.createPost(post);
      }
      ));
    })));
  }
  updatePost(post: Post): Observable<Post | undefined> {
    const postClonePromise = Post.clone(post).loadObjects(this);
    if (!postClonePromise) {
      return of(undefined);
    }
    return defer(() => from(postClonePromise).pipe(mergeMap(postClone => {
      postClone.unloadObjects();
      return this.getPostById(postClone.id, postClone.titleUrl).pipe(mergeMap(postFound => {
        if (!postFound) {
          return this.http.put<Post>(`${this._dbUrl}posts/${postClone.id}_${postClone.titleUrl}.json`, postClone)
            .pipe(mergeMap(post => {
              const clone = Post.clone(post).loadObjects(this);
              if (clone) {
                return clone;
              }
              return of(undefined);
            }));
        }
        post.id = post.generateId();
        post.titleUrl = post.titleUrl + post.generateId();
        return this.createPost(post);
      }
      ));
    })));
  }
  getPostById(postId: string, postTitleUrl: string): Observable<Post | undefined> {
    return this.http.get<Post>(`${this._dbUrl}posts/${postId}_${postTitleUrl}.json`).pipe(mergeMap(post => {
      if (post) {
        const postClonePromise = Post.clone(post).loadObjects(this);
        if (postClonePromise) {
          return defer(() => from(postClonePromise));
        }
      }
      return of(undefined);
    }));;
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
        var postListClone: Post[] = [];
        const postList = Object.values(posts);
        postList.forEach(post => {
          const postClonePromise = Post.clone(post).loadObjects(this);
          if (postClonePromise) {
            postClonePromise.then(loadedPost => postListClone.push(loadedPost));
          }
        });
        return postListClone;
      }), tap(posts => {
        console.log('--- Loading posts ---')
        console.log(posts);
        console.log('');
      }));
  }
}