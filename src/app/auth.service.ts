import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string) {
    const addr = 'http://localhost:80';
    const body = new HttpParams()
      .set('username', email)
      .set('password', password)
      .set('grant_type', 'password')
      .set('client_id', 'browser')
      .set('client_secret', 'browser');
    return this.http.post(`${addr}/oauth/token`,
      body,
      { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded') }
    );
  }
}
