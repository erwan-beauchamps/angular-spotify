import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private _httpClient: HttpClient) { }

  getMe(): Observable<any> {
    return this._httpClient.get('https://api.spotify.com/v1/me');
  }

  getPlaylist(userId: string): Observable<any> {
    return this._httpClient.get('https://api.spotify.com/v1/users/' + userId + '/playlists');
  }

  getPlaylistById(playlistId: string): Observable<any> {
    return this._httpClient.get('https://api.spotify.com/v1/playlists/' + playlistId);
  }

  get(url: string): Observable<any> {
    return this._httpClient.get(url);
  }

}
