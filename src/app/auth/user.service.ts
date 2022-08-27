import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
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

  signIn(email: string, password: string) {
    this.http.post<FirebaseResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp',
      {
        email: email,
        password: password,
        returnSecureToken: true
      },
      {
        params: new HttpParams().append('key', environment.apiKey)
      }
    ).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.error(error)
    });
  }

  login(email: string, password: string) {
    this.http.post<FirebaseResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
      {
        email: email,
        password: password,
        returnSecureToken: true
      },
      {
        params: new HttpParams().append('key', environment.apiKey)
      }
    ).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.error(error)
    });
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

}