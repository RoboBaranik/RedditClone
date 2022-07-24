import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BannerComponent } from './banner/banner.component';
import { WallComponent } from './wall/wall.component';
import { PostListComponent } from './wall/post-list/post-list.component';
import { PostComponent } from './wall/post-list/post/post.component';
import { WallSidebarComponent } from './wall/wall-sidebar/wall-sidebar.component';
import { PostCreateComponent } from './wall/post-list/post-create/post-create.component';
import { PostFilterComponent } from './wall/post-list/post-filter/post-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BannerComponent,
    WallComponent,
    PostListComponent,
    PostComponent,
    WallSidebarComponent,
    PostCreateComponent,
    PostFilterComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
