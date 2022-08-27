import { Injectable, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { User } from "./user";

type Nullable<T> = T | null;

@Injectable({ providedIn: 'root' })
export class UserService implements OnInit {
  ngOnInit(): void {
  }

  constructor() {
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

  login(username: string, password: string) {
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