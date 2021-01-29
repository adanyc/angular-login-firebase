import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'https://identitytoolkit.googleapis.com/v1';
  private apiKey = '';

  constructor(private http: HttpClient) {
    this.readToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
  }

  login(user: UserModel) {
    const authData = {
      ...user,
      returnSecureToken: true,
    };

    return this.http.post(
      `${this.url}/accounts:signInWithPassword?key=${this.apiKey}`,
      authData,
    ).pipe(
      map(resp => {
        this.saveToken(resp['idToken']);
        return resp;
      })
    );
  }

  register(user: UserModel) {
    const authData = {
      ...user,
      returnSecureToken: true,
    };

    return this.http.post(
      `${this.url}/accounts:signUp?key=${this.apiKey}`,
      authData,
    ).pipe(
      map(resp => {
        this.saveToken(resp['idToken']);
        return resp;
      })
    );
  }

  private saveToken(idToken: string) {
    localStorage.setItem('token', idToken);

    const currentDate = new Date();
    currentDate.setSeconds(3600);
    localStorage.setItem('expires', currentDate.getTime().toString());
  }

  private readToken() {
    return localStorage.getItem('token') || '';
  }

  isAuthenticated() {
    if (this.readToken().length < 2) {
      return false;
    }

    const expires = Number(localStorage.getItem('expires'));
    const expiresDate = new Date();
    expiresDate.setTime(expires);

    return expiresDate > new Date();
  }
}
