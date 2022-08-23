import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MainPageLayoutComponent } from './content/main-page-layout/main-page-layout.component';
import { PostDetailLayoutComponent } from './content/post-detail-layout/post-detail-layout.component';
import { SubredditLayoutComponent } from './content/subreddit-layout/subreddit-layout.component';

const routes: Routes = [
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