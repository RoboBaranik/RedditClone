import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { UserService } from "src/app/user.service";
import { Comment } from "./comment";
import { Post } from "./post";
import { PostImage } from "./post-image";

@Injectable({ providedIn: 'root' })
export class PostService {

  postList: Post[] = [];
  postListSub: Subject<Post[]> = new Subject<Post[]>();

  constructor(private userService: UserService) {
    this.postList.push(
      new Post('r/Reddit', 'u/redditor', 'A nice title for a post', 'This is a description of a post. Should be clear enough. :)'),
      new Post('r/leagueoflegends', 'u/someone', 'Hmm, what is this?', '', { images: [new PostImage('https://preview.redd.it/runidc8ephd91.jpg?width=1080&format=pjpg&auto=webp&s=b570cbaebcad4d7dc4bf4e4d5e6a546d438db965', 'What')] }),
      new Post('r/Important', 'u/yasuoplayer', 'What?', 'Ahh yes, I almost forgot. This is really important description of my post. Never delete it. Please :)'),
      new Post('r/Test', 'u/loremipsumman', 'A loong post', `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vehicula venenatis erat, rutrum consequat dolor bibendum et. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce interdum erat at odio bibendum fringilla. Mauris suscipit lacinia turpis, sit amet porttitor felis semper sed. Cras fringilla vulputate ultrices. Cras ac viverra mauris. Donec a tincidunt nulla, vel mattis enim.
      
      Morbi ultricies facilisis eros at mattis. Praesent quis nibh odio. Phasellus eget imperdiet nunc, id egestas enim. Praesent in massa scelerisque, finibus risus eu, pharetra turpis. Curabitur laoreet euismod lorem nec luctus. Proin vitae mauris diam. Morbi a fermentum lorem, sed suscipit massa. Vestibulum interdum placerat purus, ut auctor ex congue sed.
      
      Vestibulum lobortis vel eros eu fringilla. Ut quis facilisis nunc. Nunc pellentesque enim eget tristique finibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc semper euismod massa at pulvinar. Nunc lobortis lorem sed posuere laoreet. Aenean a arcu eu ante ornare dapibus. Phasellus a tortor ut velit blandit ultrices ac in leo. Quisque id elit ullamcorper, feugiat tortor eget, ultricies lorem. Mauris lacinia massa a lacus semper venenatis. Donec mattis, erat eu congue tempor, tellus ex sagittis augue, eget efficitur urna nulla vitae felis. Donec lectus arcu, tempus quis blandit vitae, volutpat vel lorem.
      
      Nulla hendrerit leo id lobortis varius. Proin nec tempus ex. Morbi aliquet accumsan tortor nec venenatis. Pellentesque blandit ac sem vel sodales. Vivamus vitae lorem non risus efficitur placerat sit amet vel lectus. Aenean consequat, purus in commodo lobortis, lectus purus eleifend lorem, id placerat quam eros ut augue. Phasellus et libero in dui ultricies pellentesque. Sed et volutpat sem. Etiam elementum sagittis lacus, at sollicitudin massa vehicula vel. Donec rutrum suscipit magna, sit amet scelerisque neque gravida eget. Mauris in pellentesque dolor. Aliquam viverra, urna nec sodales elementum, sem leo ullamcorper libero, sit amet congue leo metus vel orci. Integer sodales elit et placerat sagittis. Quisque volutpat magna non nibh fringilla dapibus.
      
      Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce molestie, sem volutpat sagittis rhoncus, lorem ipsum vehicula eros, vitae commodo dui turpis ac nisi. Donec non commodo tellus. Aenean luctus urna vitae aliquet semper. Quisque sit amet arcu posuere, sollicitudin quam ut, aliquet mauris. Sed pulvinar purus odio, a maximus quam gravida eu. Nunc in eros nec ante tempor semper. Donec sit amet ultrices velit. Donec sed lectus nec ligula sollicitudin gravida ac in lectus. Ut et elementum sapien. Nulla rhoncus lacinia urna at placerat. Integer felis ipsum, pharetra sed metus id, pretium malesuada tortor. Suspendisse sapien nulla, sollicitudin eu dolor a, vehicula fringilla metus. Donec auctor, tellus ac vulputate dapibus, nibh diam ultrices lorem, at placerat leo velit molestie diam.`)
    );
  }

  createPost(title: string, text: string): Post {
    if (!this.userService.user) {
      throw new Error('Please log in!');
    }
    var newPost = new Post('r/Reddit', this.userService.user.name, title, text);
    this.postList.push(newPost);
    this.postListSub.next(this.postList);
    return newPost;
  }
  getPostByListIndex(id: number) {
    return this.postList[id];
  }
  getPost(postId: string, postTitleUrl: string) {
    return this.postList.find(post => post.id === postId && post.titleUrl.localeCompare(postTitleUrl) === 0);
  }
  getPostAll() {
    return this.postList.slice();
  }
  editPost(id: number, updatedPost: Post) {
    this.postList[id] = updatedPost;
    this.postListSub.next(this.postList);
  }
  deletePost(id: number) {
    this.postList.splice(id, 1);
    this.postListSub.next(this.postList);
  }
  addComment(post: Post, comment: Comment) {
    var foundPost = this.getPost(post.id, post.titleUrl);
    if (foundPost) {
      foundPost.addComment(comment);
    }
    this.postListSub.next(this.postList);
  }

}