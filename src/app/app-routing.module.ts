import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MainPageComponent } from './content/main-page/main-page.component';
import { PostDetailComponent } from './content/post-detail/post-detail.component';
import { SubredditComponent } from './content/subreddit/subreddit.component';

const routes: Routes = [
  { path: 'r/:name/:postid/:posttitle', component: PostDetailComponent },
  { path: 'r/:name', component: SubredditComponent },
  { path: 'u/:name', component: MainPageComponent },
  { path: '', component: MainPageComponent, pathMatch: 'full' }//,
  // { path: '**', component: ContentComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }