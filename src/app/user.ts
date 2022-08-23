export class User {
  constructor(public name: string, private _password: string, public avatarUrl: string, public karma: number) {
  }

  isPasswordCorrect(givenPassword: string): boolean {
    return this._password.localeCompare(givenPassword) === 0;
  }
}