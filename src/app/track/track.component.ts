import { switchMap, tap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';
import { Track } from '../home/home.component';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit {

  public name: string = "Mon nom";
  public tracks: Track[] = [];

  constructor(private _spotifyService: SpotifyService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    let trackId: string|null = this.route.snapshot.paramMap.get('trackId');
    if (trackId) {
      this._spotifyService.getPlaylistById(trackId).pipe(
        tap((playlist) => {
          this.name = playlist.name;
          this.tracks = playlist.tracks.items.map((item: any) => item.track);
          console.log('tracks', this.tracks);
        })
      ).subscribe();
    }
  }

  goToLink(url: string){
    window.open(url, "_blank");
}

}
