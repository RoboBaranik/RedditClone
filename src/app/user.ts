export class User {
  name: string;
  password: string;
  avatarUrl: string;
  karma: number;

  constructor(name: string, password: string, avatarUrl: string, karma: number) {
    this.name = name;
    this.password = password;
    this.avatarUrl = avatarUrl;
    this.karma = karma;
  }
}