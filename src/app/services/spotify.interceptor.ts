import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, EMPTY, EmptyError, Observable, switchMap } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class SpotifyAccessTokenInterceptor implements HttpInterceptor {

  constructor(private _authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!req.url.includes('https://api.spotify.com')) {
      return next.handle(req);
    }
    return this._authService.getToken().pipe(
      switchMap((accessToken: string|null) => {
        console.log(accessToken);
        return next.handle(req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + (accessToken? accessToken: ''))
          .set('Content-Type', 'application/x-www-form-urlencoded;')
        }));
      },
    ), catchError((error: any) => {
      localStorage.removeItem('access_token');
      this._authService.getAuthorize();
      return EMPTY;
    }));
  }
}