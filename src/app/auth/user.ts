export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public avatarUrl: string,
    public karma: number,
  ) { }

  get uname() {
    return 'u/' + this.name;
  }

  // isPasswordCorrect(givenPassword: string): boolean {
  //   return this._password.localeCompare(givenPassword) === 0;
  // }
}