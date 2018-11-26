import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AuthPayload } from './login/authPayload';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  // TODO: handle expired tokens

  static readonly authStorage = 'access_token';
  static readonly refreshStorage = 'refresh_token';

  isAuthenticated = false;

  static readonly tokenGetter = () => localStorage.getItem(AuthService.authStorage);

  login(email: string, password: string) {
    const addr = 'http://localhost:80';
    const body = new HttpParams()
      .set('username', email)
      .set('password', password)
      .set('grant_type', 'password')
      .set('client_id', 'browser')
      .set('client_secret', 'browser');
    this.http.post(`${addr}/oauth/token`,
      body,
      { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded') }
    ).subscribe(payload => {
      const authPayload = payload as AuthPayload;
      localStorage.setItem(AuthService.authStorage, authPayload.access_token);
      localStorage.setItem(AuthService.refreshStorage, authPayload.refresh_token);
      this.isAuthenticated = true;
      console.log(`User ${email} is logged in`);
    });
  }
}
