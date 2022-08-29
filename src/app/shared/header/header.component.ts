import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user';
import { UserService } from 'src/app/auth/user.service';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  loggedUser?: User;
  private _loggedUserSubscription?: Subscription;

  constructor(private userService: UserService, private databaseService: DatabaseService, private router: Router) { }

  ngOnInit(): void {
    this._loggedUserSubscription = this.userService.userUpdated.subscribe(user => this.loggedUser = user);
  }
  ngOnDestroy(): void {
    this._loggedUserSubscription?.unsubscribe();
  }

  logOut() {
    this.userService.logOut();
    this.router.navigate(['login']);
    // if (this.loggedUser) this.databaseService.getUser('u/username').subscribe((user) => console.log(user));
    // if (this.loggedUser) this.databaseService.createUser(this.loggedUser).subscribe((user) => console.log(user));
  }

}
