export class User {
  constructor(
    public name: string,
    private _password: string,
    public avatarUrl: string,
    public karma: number
  ) { }

  get id() {
    return 'u/' + this.name;
  }

  isPasswordCorrect(givenPassword: string): boolean {
    return this._password.localeCompare(givenPassword) === 0;
  }
}