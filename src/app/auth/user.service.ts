import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Observable, Subject, Subscription, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthType } from "./auth.component";
import { User } from "./user";

interface FirebaseResponse {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({ providedIn: 'root' })
export class UserService implements OnInit {
  ngOnInit(): void {
  }

  constructor(private http: HttpClient) {
    this._users = [
      new User('user1', 'pass', 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png', 5),
      new User('platipus42', 'pass', 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_2.png', 1505),
      new User('fakermaster69', 'pass', 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_3.png', -200),
      new User('defaultplayer', 'pass', 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_4.png', 100000),
      new User('ryba', 'pass', 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png', 23),
      new User('bot1111', 'pass', 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_6.png', 54321)
    ];
  }

  private _user: User | undefined = undefined;
  userUpdated: Subject<User> = new Subject<User>();
  private _users: User[] = [];

  signUp(email: string, password: string): Observable<FirebaseResponse> {
    return this.formRequest(email, password, AuthType.SIGNUP);
  }

  logIn(email: string, password: string): Observable<FirebaseResponse> {
    return this.formRequest(email, password, AuthType.LOGIN);
  }
  private formRequest(email: string, password: string, type: AuthType): Observable<FirebaseResponse> {
    return this.http.post<FirebaseResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:${this.getUrlSuffix(type)}`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      },
      {
        params: new HttpParams().append('key', environment.apiKey)
      }
    ).pipe(tap(response => {
      localStorage.setItem('userData', JSON.stringify(response));
    }));
  }

  loginTest(username: string, password: string) {
    var user = this._users.find(user => user.name.localeCompare(username) === 0 && user.isPasswordCorrect(password));
    if (user) {
      this._user = user;
      this.userUpdated.next(this._user);
    }
  }
  get user(): User | undefined {
    return this._user;
  }
  logout() {
    this._user = undefined;
  }
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

}