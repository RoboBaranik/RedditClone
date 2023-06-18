import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  mergeMap,
  Observable,
  Subject,
  Subscription,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { DatabaseService } from '../shared/database.service';
import { AuthType } from './auth.component';
import { User } from './user';
import { signInWithEmailAndPassword } from '@angular/fire/auth';
import { list } from '@angular/fire/database';
import { Query } from 'firebase/firestore';

interface FirebaseResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService implements OnInit {
  ngOnInit(): void {}

  constructor(private dbService: DatabaseService, private http: HttpClient) {
    this._users = [
      new User(
        'asd1',
        'user1',
        '',
        'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png',
        5,
        new Date()
      ),
      new User(
        'asd2',
        'platipus42',
        '',
        'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_2.png',
        1505,
        new Date()
      ),
      new User(
        'asd3',
        'fakermaster69',
        '',
        'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_3.png',
        -200,
        new Date()
      ),
      new User(
        'asd4',
        'defaultplayer',
        '',
        'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_4.png',
        100000,
        new Date()
      ),
      new User(
        'asd5',
        'ryba',
        '',
        'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png',
        23,
        new Date()
      ),
      new User(
        'asd6',
        'bot1111',
        '',
        'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_6.png',
        54321,
        new Date()
      ),
    ];
  }

  // private _user: User | undefined = undefined;
  userUpdated: BehaviorSubject<User | undefined> = new BehaviorSubject<
    User | undefined
  >(undefined);
  private _users: User[] = [];
  private _logOutTimeout?: any;

  signUp(
    username: string,
    email: string,
    password: string
  ): Observable<User | undefined> {
    return this.formRequest(email, password, AuthType.SIGNUP).pipe(
      mergeMap((response) => {
        const userToCreate = new User(
          response.localId,
          username,
          email,
          this.getRandomAvatarUrl(),
          0,
          new Date()
        );
        return this.dbService.createUser(userToCreate);
      }),
      tap((user) => {
        if (!!user) {
          this.userUpdated.next(user);
        }
      })
    );
  }

  logIn(email: string, password: string): Observable<FirebaseResponse> {
    // list('/asd');
    return this.formRequest(email, password, AuthType.LOGIN);
  }
  private formRequest(
    email: string,
    password: string,
    type: AuthType
  ): Observable<FirebaseResponse> {
    return this.http
      .post<FirebaseResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:${this.getUrlSuffix(
          type
        )}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        },
        {
          params: new HttpParams().append('key', environment.apiKey),
        }
      )
      .pipe(
        tap((response) => {
          this.onLogInSuccess(response);
        })
      );
  }
  private onLogInSuccess(response: FirebaseResponse) {
    localStorage.setItem('userData', JSON.stringify(response));
    this.getUserFromResponse(response).subscribe((user) => {
      user.lastLogin = new Date();
      this.userUpdated.next(user);
      this._logOutTimeout = setTimeout(() => {
        this.logOut();
      }, +response.expiresIn * 1000);
      this.dbService.updateUser(user.id, user).subscribe({
        next: (lastLogin) => {
          console.log(
            `Last login: ${
              lastLogin ? new Date(lastLogin).toLocaleString() : 'unknown'
            }`
          );
        },
        error: (e) => {
          console.error('Unable to update user', e);
        },
      });
    });
  }
  autoLogIn() {
    var userData = localStorage.getItem('userData');
    if (userData) {
      this.getUserFromResponse(JSON.parse(userData)).subscribe((user) => {
        if (user) {
          this.userUpdated.next(user);
          console.log('Auto login successful. Welcome, ' + this.user?.name);
        }
      });
    }
  }
  logOut() {
    localStorage.removeItem('userData');
    this.userUpdated.next(undefined);
    if (this._logOutTimeout) {
      clearTimeout(this._logOutTimeout);
    }
  }

  // loginTest(username: string, password: string) {
  //   var user = this._users.find(user => user.name.localeCompare(username) === 0 && user.isPasswordCorrect(password));
  //   if (user) {
  //     this._user = user;
  //     this.userUpdated.next(this._user);
  //   }
  // }
  get user(): User | undefined {
    return this.userUpdated.getValue();
  }
  // logout() {
  //   this._user = undefined;
  // }
  getUserByMockId(id: number): User | undefined {
    if (id >= 0 && id < this._users.length) {
      return this._users[id];
    }
    return undefined;
  }
  getNumberOfMockUsers(): number {
    return this._users.length;
  }
  getUrlSuffix(type: AuthType): string {
    switch (type) {
      case AuthType.LOGIN:
        return 'signInWithPassword';
      default:
      case AuthType.UNDEFINED:
      case AuthType.SIGNUP:
        return 'signUp';
    }
  }
  getUserFromResponse(response: FirebaseResponse): Observable<User> {
    return this.dbService.getUserById(response.localId);
    // return new User(response.localId, 'u/username', response.email, '', 0);
  }
  getRandomAvatarUrl(): string {
    const id = Math.floor(Math.random() * 8);
    return `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${id}.png`;
  }
}
