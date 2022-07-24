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

  user: Nullable<User> = null;
  userUpdated: Subject<User> = new Subject<User>();
  users: User[] = [];

  login(username: string, password: string) {
    var user = this.users.find(user => user.name.localeCompare(username) === 0 && user.password.localeCompare(password) === 0);
    if (user) {
      this.user = user;
      this.userUpdated.next(this.user);
    }
  }
  logout() {
    this.user = null;
  }

}