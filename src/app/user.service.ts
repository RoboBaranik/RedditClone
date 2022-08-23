import { Injectable, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { User } from "./user";

type Nullable<T> = T | null;

@Injectable({ providedIn: 'root' })
export class UserService implements OnInit {
  ngOnInit(): void {
    this.users = [
      new User('User1', 'pass', 'none', 5)
    ];
  }

  _user: User | undefined = undefined;
  userUpdated: Subject<User> = new Subject<User>();
  users: User[] = [];

  login(username: string, password: string) {
    var user = this.users.find(user => user.name.localeCompare(username) === 0 && user.isPasswordCorrect(password));
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

}