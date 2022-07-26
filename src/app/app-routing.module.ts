import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { MainPageLayoutComponent } from './main-page/main-page-layout/main-page-layout.component';
import { PostDetailLayoutComponent } from './post-detail/post-detail-layout/post-detail-layout.component';
import { SubmitLayoutComponent } from './submit/submit-layout/submit-layout.component';
import { SubredditLayoutComponent } from './subreddit/subreddit-layout/subreddit-layout.component';

const routes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'signup', component: AuthComponent },
  { path: 'submit', component: SubmitLayoutComponent },
  { path: 'r/:name/:postid/:posttitle', component: PostDetailLayoutComponent },
  { path: 'r/:name', component: SubredditLayoutComponent },
  { path: 'u/:name', component: MainPageLayoutComponent },
  { path: '', component: MainPageLayoutComponent, pathMatch: 'full' }//,
  // { path: '**', component: ContentComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }