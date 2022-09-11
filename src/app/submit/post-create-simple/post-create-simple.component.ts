import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/user';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'post-create-simple',
  templateUrl: './post-create-simple.component.html',
  styleUrls: ['./post-create-simple.component.css']
})
export class PostCreateSimpleComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  getUser(): User | undefined {
    return this.userService.user;
  }
  createPost(): void {
    this.router.navigate(["submit"]);
  }

}
