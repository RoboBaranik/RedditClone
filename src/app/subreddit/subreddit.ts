export class Subreddit {
  constructor(public name: string, public avatarUrl?: string) { }

  get rname() {
    return Subreddit.subredditWithPrefix(this.name);
  }
  static subredditWithPrefix(subreddit: string) {
    return 'r/' + subreddit;
  }
  static clone(original: Subreddit) {
    return new Subreddit(original.name, original.avatarUrl);
  }
}