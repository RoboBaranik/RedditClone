import { Component, Input, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Post } from './post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post!: Post;

  private ignoreOnClickElements: string[] = ['mat-icon', 'button', 'a'];
  private mousePosition: { x: number, y: number } = {
    x: 0,
    y: 0
  };

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  postClicked(event: MouseEvent): void {
    if (Math.abs(this.mousePosition.x - event.screenX) > 5 ||
      Math.abs(this.mousePosition.y - event.screenY) > 5) {
      return;
    }

    var elementClicked = (<HTMLElement>event.target);
    for (var i = 0; i < 3; i++) {
      if (this.ignoreOnClickElements.find(element => element === elementClicked.localName)) {
        return;
      }
      if (!elementClicked.parentElement) {
        return;
      }
      elementClicked = elementClicked.parentElement;
    }
    this.navigateToDetails();
  }
  navigateToDetails() {
    this.router.navigate([this.post.subreddit, this.post.id, this.post.titleUrl]);
  }

  postMouseDown(event: MouseEvent) {
    this.mousePosition.x = event.screenX;
    this.mousePosition.y = event.screenY;
  }

}
