export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public avatarUrl: string,
    public karma: number,
  ) { }

  get uname() {
    return User.usernameWithPrefix(this.name);
  }

  static usernameWithPrefix(username: string) {
    return 'u/' + username;
  }

  // isPasswordCorrect(givenPassword: string): boolean {
  //   return this._password.localeCompare(givenPassword) === 0;
  // }
}