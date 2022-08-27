import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';

@Component({
  selector: 'post-detail-layout',
  templateUrl: './post-detail-layout.component.html',
  styleUrls: ['./post-detail-layout.component.css']
})
export class PostDetailLayoutComponent implements OnInit {
  /* type: ContentType = ContentType.Reddit;
  name: String = ''; */

  constructor(/* private route: ActivatedRoute */) { }

  ngOnInit(): void {
    /*     console.log(this.route);
        this.route.url.subscribe(url => {
          this.determineType(url);
          console.log('Content type: ' + this.type + '. Content name: ' + this.name);
        }); */
  }

  /* determineType(url: UrlSegment[]) {
    if (!url || url.length < 2) {
      this.type = ContentType.Wall;
      this.name = '';
      return;
    }

    switch (url[0].path) {
      default:
      case 'r':
        this.type = ContentType.Reddit;
        break;
      case 'u':
        this.type = ContentType.User;
        break;
    }
    this.name = url[1].path;
  } */



}
/* enum ContentType {
  Wall = 'Wall',
  Reddit = 'Reddit',
  User = 'User'
} */
