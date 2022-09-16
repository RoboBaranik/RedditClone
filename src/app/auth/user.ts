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
  static clone(original: User) {
    return new User(original.id, original.name, original.email, original.avatarUrl, original.karma);
  }

  // isPasswordCorrect(givenPassword: string): boolean {
  //   return this._password.localeCompare(givenPassword) === 0;
  // }
}