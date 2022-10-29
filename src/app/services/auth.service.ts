import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private requestAuthUrl = 'https://accounts.spotify.com/authorize';
  private requestApiUrl = 'https://accounts.spotify.com/api/token';
  private client_id = 'YOUR CLIENT ID';
  private client_secret = 'YOUR CLIENT SECRET';
  private redirect_uri = 'http://localhost:4200/login';

  constructor(private _httpClient: HttpClient) { }

  public getToken(): Observable<string|null> {

      let tokenStorage = localStorage.getItem('access_token');

      let headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer(this.client_id + ':' + this.client_secret)).toString('base64')
      };
      
      let params = 'grant_type=authorization_code&' +
      'code=' + localStorage.getItem('authorization_code') + '&' +
      'redirect_uri=' + this.redirect_uri;

      if (tokenStorage) {
        return of(tokenStorage);
      } else  {
        return this._httpClient.post(this.requestApiUrl, params, {headers}).pipe(
          map((result: any) => {
            let resultToken: string = result['access_token'];
            if (resultToken) {
              localStorage.setItem('access_token', result['access_token']);
            }
            return resultToken? resultToken: '';
          }));
      }
  }

  public getAuthorize(): void {
    window.location.href = this.buildAuthUrl();
  }

  private buildAuthUrl(): string{

    let authConfig = { 
      client_id: this.client_id, 
      response_type: "code",
      redirect_uri: this.redirect_uri,
      state: "",
      show_dialog: true,
      scope: 'user-read-private user-read-email'
    };

    let params = [];
    for (const [key, value] of Object.entries(authConfig)) {
      if(typeof(value) == 'object'){
        params.push(`${key}=${(value as string[]).join(" ")}`);
      }else{
        params.push(`${key}=${value}`);
      }
    }

    return `${this.requestAuthUrl}?${params.join('&')}`;
  }
}