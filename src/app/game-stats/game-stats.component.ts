import { Component } from '@angular/core';
import {Team} from '../data.models';
import {map, Observable, tap} from 'rxjs';
import {NbaService} from '../nba.service';

@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.css']
})
export class GameStatsComponent {

  teams$: Observable<Team[]>;
  allTeams: Team[] = [];
  conferences: string[] = [];
  divisions: string[] = [];

  constructor(protected nbaService: NbaService) {
    this.teams$ = nbaService.getAllTeams().pipe(
      map(data => data.sort((a, b) => {
        if(a.full_name < b.full_name) return -1;
        if(a.full_name > b.full_name) return 1;
        return 0;
      })),
      tap(data => this.allTeams = data),
      tap(data => {
        let temp: string[] = [];
        data.forEach(x => {
          if(temp.indexOf(x.conference) == -1) temp.push(x.conference);
        });
        this.conferences = temp;
      }),
      tap(data => {
        let temp: string[] = [];
        data.forEach(x => {
          if(temp.indexOf(x.division) == -1) temp.push(x.division)
        });
        this.divisions = temp;
      })
    );
  }

  trackTeam(teamId: string): void {
    let team = this.allTeams.find(team => team.id == Number(teamId));
    if (team)
      this.nbaService.addTrackedTeam(team);
  }
}
