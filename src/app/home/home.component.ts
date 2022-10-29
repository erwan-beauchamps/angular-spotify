import { switchMap, tap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';

export interface Track {
  name: string;
  id: string;
  album: Album;
  external_urls: {
    spotify: string;
  }
}

export interface Album {
  name: string;
  id: string;
  images: Image[];
}

export interface Image {
  height: number;
  width: number;
  url: string;
}

export interface Playlist {
  name: string;
  id: string;
  images: Image[];
  tracks: {
    href: string;
    total: number;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public playlists: Playlist[] = [];
  public name: string = "Mon nom";

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit(): void {
    // APPEL API
    this._spotifyService.getMe().pipe(
      tap((me) => {
        console.log('me', me);
        this.name = me['display_name'];
      }),
      switchMap(me => this._spotifyService.getPlaylist(me['id'])),
      tap((playlistItems) => {
        console.log('playlists', playlistItems);
        this.playlists = playlistItems.items.sort((item: any) => item.name !== undefined );
      }),
      switchMap(playlists => this._spotifyService.get(playlists?.items[0]?.tracks.href)),
      tap(tracks => {
        console.log('tracks', tracks)
      })
    ).subscribe();
  }

}
