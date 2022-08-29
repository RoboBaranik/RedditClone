import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../auth/user";

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  constructor(private http: HttpClient) {
  }
  private _dbUrl: string = 'https://redditclone-e791d-default-rtdb.europe-west1.firebasedatabase.app/';
  createUser(user: User): Observable<User> {
    return this.http.put<User>(`${this._dbUrl}users/${user.id}.json`, user);
  }
  getUserByUsername(name: string): Observable<{ [key: string]: User }> {
    return this.http.get<{ [key: string]: User }>(`${this._dbUrl}users.json`,
      {
        params: new HttpParams()
          .append('orderBy', '"name"')
          .append('equalTo', `"${name}"`)
      });
  }
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this._dbUrl}users/${id}.json`);
  }
}