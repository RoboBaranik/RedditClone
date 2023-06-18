import { IUser, Model } from '../model/model';
import { DatabaseService } from '../shared/database.service';

export class User implements Model<User, IUser> {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public avatarUrl: string,
    public karma: number,
    public lastLogin: Date
  ) {}

  get uname() {
    return User.usernameWithPrefix(this.name);
  }

  static usernameWithPrefix(username: string) {
    return 'u/' + username;
  }
  static clone(original: User) {
    return new User(
      original.id,
      original.name,
      original.email,
      original.avatarUrl,
      original.karma,
      original.lastLogin
    );
  }
  static from(iUser: IUser): User {
    return new User(
      iUser.id,
      iUser.name,
      iUser.email,
      iUser.avatarUrl,
      iUser.karma,
      new Date(iUser.lastLogin)
    );
  }
  from(intface: IUser, dbService: DatabaseService): Promise<User> {
    // return User.from(iUser);
    return new Promise(async (resolve, reject) => {
      resolve(User.from(intface));
    });
  }
  toInterface(): IUser {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      avatarUrl: this.avatarUrl,
      karma: this.karma,
      lastLogin: this.lastLogin.toISOString(),
    };
  }
  // loadData(dbService: DatabaseService): Promise<User> {
  //   return new Promise(async (resolve, reject) => {
  //     resolve(this);
  //   });
  // }
  static emptyModel(): User {
    return new User('', '', '', '', 0, new Date());
  }
  emptyModel(): User {
    return User.emptyModel();
  }

  // isPasswordCorrect(givenPassword: string): boolean {
  //   return this._password.localeCompare(givenPassword) === 0;
  // }
}
