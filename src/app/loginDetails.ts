export class LoginDetails {
  grant_type = 'password';
  username: string;
  password: string;
  scope = 'ui';
  client_id = 'browser';
  client_secret = 'browser';

  constructor(e, p) {
    this.username = e;
    this.password = p;
  }
}
