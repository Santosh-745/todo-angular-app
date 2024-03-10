import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Subject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  message: string,
  statusCode: number,
  accessToken: string,
}

interface jwtPayload {
  id: number,
  email: string,
  exp: number,
  iat: number,
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User|null>(null);
  // // https://stackoverflow.com/questions/43348463/what-is-the-difference-between-subject-and-behaviorsubject
  private tokenExpirationTimer: any;
  private url: string = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `${this.url}/signup`,
        {
          email,
          password,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          const data = jwtDecode<jwtPayload>(resData.accessToken);
          this.handleAuthentication(
            data.email,
            data.id.toString(),
            resData.accessToken,
            +data.exp
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `${this.url}/login`,
        {
          email,
          password,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          const data = jwtDecode<jwtPayload>(resData.accessToken);
          this.handleAuthentication(
            data.email,
            data.id.toString(),
            resData.accessToken,
            +data.exp
          );
        })
      );
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    if ((this.tokenExpirationTimer)) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userData) return;
    let loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      userData._tokenExpirationDate
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    console.log("exp: ", expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      this.router.navigate(['/auth']);  
    }, expirationDuration);
  }

  handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    let expirationDate = new Date(expiresIn * 1000);
    let user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(new Date(expiresIn * 1000).getTime() - new Date().getTime());
    localStorage.setItem('userData', JSON.stringify(user));
  }

  handleError(errorRes: HttpErrorResponse) {
    let errorMsg = 'Unknown Error Occured!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMsg);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMsg = 'This Email Already Exists';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMsg = 'Email not found';
        break;
      case 'INVALID_PASSWORD':
        errorMsg = 'This password is incorrect';
        break;
    }
    return throwError(errorMsg);
  }
}
