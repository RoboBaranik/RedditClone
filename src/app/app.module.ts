import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { BannerComponent } from './shared/banner/banner.component';
import { PostListComponent } from './subreddit/post-list/post-list.component';
import { PostComponent } from './subreddit/post/post.component';
import { WallSidebarComponent } from './shared/wall-sidebar/wall-sidebar.component';
import { PostFilterComponent } from './subreddit/post-filter/post-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { PostDetailLayoutComponent } from './post-detail/post-detail-layout/post-detail-layout.component';
import { MainPageLayoutComponent } from './main-page/main-page-layout/main-page-layout.component';
import { SubredditLayoutComponent } from './subreddit/subreddit-layout/subreddit-layout.component';
import { PostDetailComponent } from './post-detail/post-detail/post-detail.component';
import { CommentComponent } from './post-detail/comment/comment.component';
import { AuthComponent } from './auth/auth.component';
import { UserService } from './auth/user.service';
import { PostCreateSimpleComponent } from './submit/post-create-simple/post-create-simple.component';
import { PostCreateComponent } from './submit/post-create/post-create.component';
import { SubmitLayoutComponent } from './submit/submit-layout/submit-layout.component';
import { TimePastPipe } from 'ng-time-past-pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BannerComponent,
    PostListComponent,
    PostComponent,
    WallSidebarComponent,
    PostCreateComponent,
    PostFilterComponent,
    PostDetailLayoutComponent,
    MainPageLayoutComponent,
    SubredditLayoutComponent,
    PostDetailComponent,
    CommentComponent,
    AuthComponent,
    PostCreateSimpleComponent,
    SubmitLayoutComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    HttpClientModule,
    TimePastPipe
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: (userService: UserService) => () => { return userService.autoLogIn(); },
    deps: [UserService],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
