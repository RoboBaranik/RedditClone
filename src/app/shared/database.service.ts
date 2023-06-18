import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defer, from, map, mergeMap, Observable, of, tap } from 'rxjs';
import { User } from '../auth/user';
import { Post } from '../subreddit/post/post';
import { Subreddit } from '../subreddit/subreddit';
import * as uuid from 'uuid';
import { DbObject, IUser, Model } from '../model/model';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  constructor(private http: HttpClient) {}
  private _dbUrl: string =
    'https://redditclone-e791d-default-rtdb.europe-west1.firebasedatabase.app/';
  private _dbUser = 'users';
  private _dbPost = 'posts';

  createUser(user: User): Observable<User | undefined> {
    return this.post(user.id, user, DbObject.USER, (user) =>
      defer(() => of(undefined))
    );
    // return this.http
    //   .put<User>(`${this._dbUrl}users/${user.id}.json`, user)
    //   .pipe(map((user) => User.clone(user)));
  }
  getUserByUsername(name: string): Observable<User | undefined> {
    return this.getFirstByField('name', name, User.emptyModel(), DbObject.USER);
    // return this.http
    //   .get<{ [key: string]: User }>(`${this._dbUrl}users.json`, {
    //     params: new HttpParams()
    //       .append('orderBy', '"name"')
    //       .append('equalTo', `"${name}"`),
    //   })
    //   .pipe(
    //     map((user) => {
    //       const foundUsers = Object.values(user);
    //       if (!foundUsers || !foundUsers[0]) {
    //         return undefined;
    //       }
    //       if (foundUsers.length > 1) {
    //         console.error(`More then one user with name ${name}`);
    //       }
    //       return User.clone(foundUsers[0]);
    //     })
    //   );
  }
  getUserById(id: string): Observable<User> {
    return this.http
      .get<User>(`${this._dbUrl}users/${id}.json`)
      .pipe(map((user) => (user ? User.clone(user) : user)));
  }
  updateUser(id: string, updatedUser: User): Observable<Date | undefined> {
    return this.update(id, updatedUser, DbObject.USER).pipe(
      map((user) => user?.lastLogin)
    );
    // return this.getUserById(id).pipe(
    //   mergeMap((user) => {
    //     if (user) {
    //       const lastLogin = user.lastLogin;
    //       return this.http
    //         .put<User>(`${this._dbUrl}users/${id}.json`, updatedUser)
    //         .pipe(map((user) => (user ? lastLogin : undefined)));
    //     }
    //     return of(undefined);
    //   })
    // );
  }
  createPost(post: Post): Observable<Post | undefined> {
    return this.post(post.id, post, DbObject.POST, (post) => {
      post.id = post.generateId();
      post.titleUrl = post.titleUrl + post.generateId();
      return this.post(post.id, post, DbObject.POST, (_) =>
        defer(() => of(undefined))
      );
    });
    // const postClonePromise = Post.clone(post).loadObjects(this);
    // if (!postClonePromise) {
    //   return of(undefined);
    // }
    // return defer(() =>
    //   from(postClonePromise).pipe(
    //     mergeMap((postClone) => {
    //       postClone.unloadObjects();
    //       return this.getPostById(postClone.id, postClone.titleUrl).pipe(
    //         mergeMap((postFound) => {
    //           if (!postFound) {
    //             return this.http
    //               .put<Post>(
    //                 `${this._dbUrl}posts/${postClone.id}_${postClone.titleUrl}.json`,
    //                 postClone
    //               )
    //               .pipe(
    //                 mergeMap((post) => {
    //                   const clone = Post.clone(post).loadObjects(this);
    //                   if (clone) {
    //                     return clone;
    //                   }
    //                   return of(undefined);
    //                 })
    //               );
    //           }
    //           post.id = post.generateId();
    //           post.titleUrl = post.titleUrl + post.generateId();
    //           return this.createPost(post);
    //         })
    //       );
    //     })
    //   )
    // );
  }
  updatePost(post: Post): Observable<Post | undefined> {
    return this.update(`${post.id}_${post.titleUrl}`, post, DbObject.POST);
    // const postClonePromise = Post.clone(post).loadObjects(this);
    // if (!postClonePromise) {
    //   return of(undefined);
    // }
    // return defer(() =>
    //   from(postClonePromise).pipe(
    //     mergeMap((postClone) => {
    //       postClone.unloadObjects();
    //       return this.getPostById(postClone.id, postClone.titleUrl).pipe(
    //         mergeMap((postFound) => {
    //           if (postFound) {
    //             return this.http
    //               .put<Post>(
    //                 `${this._dbUrl}posts/${postFound.id}_${postFound.titleUrl}.json`,
    //                 postClone
    //               )
    //               .pipe(
    //                 mergeMap((post) => {
    //                   const clone = Post.clone(post).loadObjects(this);
    //                   if (clone) {
    //                     return defer(() => from(clone));
    //                     // return clone;
    //                   }
    //                   return of(undefined);
    //                 })
    //               );
    //           }
    //           post.id = post.generateId();
    //           post.titleUrl = post.titleUrl + post.generateId();
    //           return this.createPost(post);
    //         })
    //       );
    //     })
    //   )
    // );
  }
  getPostById(
    postId: string,
    postTitleUrl: string
  ): Observable<Post | undefined> {
    return this.getById(
      `${postId}_${postTitleUrl}`,
      Post.emptyModel(),
      DbObject.POST
    );
    // return this.http
    //   .get<Post>(`${this._dbUrl}posts/${postId}_${postTitleUrl}.json`)
    //   .pipe(
    //     mergeMap((post) => {
    //       if (post) {
    //         const postClonePromise = Post.clone(post).loadObjects(this);
    //         if (postClonePromise) {
    //           return defer(() => from(postClonePromise));
    //         }
    //       }
    //       return of(undefined);
    //     })
    //   );
  }
  // TODO: Return as Map
  getPostAll(limit?: number): Observable<{ [key: string]: Post }> {
    return this.getAll(Post.emptyModel(), DbObject.POST, limit);
    // var params = new HttpParams();
    // if (limit && limit > 0) {
    //   params = params
    //     .append('orderBy', '"$value"')
    //     .append('limitToFirst', limit);
    // }

    // return this.http
    //   .get<{ [key: string]: Post }>(`${this._dbUrl}posts.json`, {
    //     params: params,
    //   })
    //   .pipe(
    //     mergeMap((posts) => {
    //       const promise = new Promise<{ [key: string]: Post }>(
    //         async (resolve, reject) => {
    //           var postListClone: { [key: string]: Post } = {};
    //           for (var key of Object.keys(posts)) {
    //             const postClonePromise = Post.clone(posts[key]).loadObjects(
    //               this
    //             );
    //             if (postClonePromise) {
    //               postListClone[key] = await postClonePromise;
    //             }
    //           }
    //           resolve(postListClone);
    //         }
    //       );

    //       return defer(() => from(promise));
    //     }),
    //     tap((posts) => {
    //       console.log('--- Loading posts ---');
    //       console.log(posts);
    //       console.log('');
    //     })
    //   );
  }
  private update<I, M extends Model<M, I>>(
    id: string,
    model: M,
    dbObject: DbObject
  ): Observable<M | undefined> {
    const intface = model.toInterface();
    return this.http.get<I>(`${this._dbUrl}${dbObject}/${id}.json`).pipe(
      mergeMap((existingObject) => {
        if (existingObject) {
          return this.http
            .put<I>(`${this._dbUrl}${dbObject}/${id}.json`, intface)
            .pipe(
              mergeMap((newObject) => {
                const promise = new Promise<M>(async (resolve, reject) => {
                  const newModel = await model.from(newObject, this);
                  resolve(newModel);
                });
                return defer(() => from(promise));
              })
            );
        }
        console.error(
          `Unable to update, model "${dbObject}" with ID "${id}" does not exist`
        );
        return defer(() => of(undefined));
      })
    );
  }
  private post<I, M extends Model<M, I>>(
    id: string,
    model: M,
    dbObject: DbObject,
    onAlreadyExists: (model: M) => Observable<M | undefined>
  ): Observable<M | undefined> {
    const intface = model.toInterface();
    return this.http.get<I>(`${this._dbUrl}${dbObject}/${id}.json`).pipe(
      mergeMap((existingObject) => {
        if (!existingObject) {
          return this.http
            .put<I>(`${this._dbUrl}${dbObject}/${id}.json`, intface)
            .pipe(
              mergeMap((newObject) => {
                const promise = new Promise<M>(async (resolve, reject) => {
                  const newModel = await model.from(newObject, this);
                  resolve(newModel);
                });
                return defer(() => from(promise));
              })
            );
        }
        console.warn(
          'Cannot create new model, model with same ID already exists, recovering...'
        );
        return onAlreadyExists(model);
      })
    );
  }
  private getById<I, M extends Model<M, I>>(
    id: string,
    emptyModel: M,
    dbObject: DbObject
  ): Observable<M | undefined> {
    return this.http.get<I>(`${this._dbUrl}${dbObject}/${id}.json`).pipe(
      mergeMap((object) => {
        if (!object) {
          return defer(() => of(undefined));
        }

        const promise = new Promise<M>(async (resolve, reject) => {
          const model = await emptyModel.from(object, this);
          resolve(model);
        });
        return defer(() => from(promise));
      })
    );
  }
  private getFirstByField<I, M extends Model<M, I>>(
    fieldName: string,
    fieldValue: string,
    emptyModel: M,
    dbObject: DbObject
  ): Observable<M | undefined> {
    return this.http
      .get<{ [key: string]: I }>(`${this._dbUrl}${dbObject}.json`, {
        params: new HttpParams()
          .append('orderBy', `"${fieldName}"`)
          .append('equalTo', `"${fieldValue}"`),
      })
      .pipe(
        mergeMap((objects) => {
          const intfaces = Object.values(objects);
          if (!intfaces || !intfaces[0]) {
            console.log(
              `No object "${dbObject}" where ${fieldName} = ${fieldValue} found`
            );
            return defer(() => of(undefined));
          }
          if (intfaces.length > 1) {
            console.log(
              `More then one object where ${fieldName} = ${fieldValue}`
            );
          }

          const promise = new Promise<M>(async (resolve, reject) => {
            const model = await emptyModel.from(intfaces[0], this);
            resolve(model);
          });
          return defer(() => from(promise));
        })
      );
  }
  private getAll<I, M extends Model<M, I>>(
    emptyModel: M,
    dbObject: DbObject,
    limit?: number
  ): Observable<{ [key: string]: M }> {
    var params = new HttpParams();
    if (limit && limit > 0) {
      params = params
        .append('orderBy', '"$value"')
        .append('limitToFirst', limit);
    }

    return this.http
      .get<{ [key: string]: I }>(`${this._dbUrl}${dbObject}.json`, {
        params: params,
      })
      .pipe(
        mergeMap((objects) => {
          const promise = new Promise<{ [key: string]: M }>(
            async (resolve, reject) => {
              const models: { [key: string]: M } = {};
              for (var key of Object.keys(objects)) {
                const intface: I = objects[key];
                const loadedPromise = emptyModel.from(intface, this);
                // const postClonePromise = Post.clone(objects[key]).loadObjects(
                //   this
                // );
                models[key] = await loadedPromise;
                // if (postClonePromise) {
                //   postListClone[key] = await postClonePromise;
                // }
              }
              resolve(models);
            }
          );

          return defer(() => from(promise));
        })
      );
  }
}
