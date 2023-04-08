import { Component } from '@angular/core';
import {Team} from '../data.models';
import { map, Observable, tap} from 'rxjs';
import {NbaService} from '../nba.service';

@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.css']
})
export class GameStatsComponent{

  teams$: Observable<Team[]>;
  allTeams: Team[] = [];
  conferences: string[] = [];
  selectedConference: number = 0;
  divisions: string[] = [];
  bckDivisions: string[] = [];
  selectedDivision: number = 0;

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
        this.bckDivisions = temp;
      })
    );
  }

  onConferenceChange(){
    this.teams$ = this.nbaService.getAllTeams().pipe(
      map(data => data.filter(x => {
        if(this.selectedConference == 0) return (this.selectedDivision == 0 || x.division == this.divisions[this.selectedDivision - 1]);
        return x.conference == this.conferences[this.selectedConference - 1];
      })),
      tap(data => {
        let temp: string[] = [];
        data.forEach(x => {
          if(temp.indexOf(x.division) == -1) temp.push(x.division)
        });
        if(this.selectedConference == 0) this.divisions = this.bckDivisions;
        else this.divisions = temp;
        if(this.selectedDivision != 0){
          console.log(data[0], this.divisions);
          this.selectedDivision = this.divisions.indexOf(data[0].division) + 1;
        }
      }),
      tap(data => this.allTeams = data)
    );
  }

  onDivisionChange(){
    this.teams$ = this.nbaService.getAllTeams().pipe(
      map(data => data.filter(x => {
        if(this.selectedDivision == 0) return (this.selectedConference == 0 || x.conference == this.conferences[this.selectedConference - 1]);
        return x.division == this.divisions[this.selectedDivision - 1];
      })),
      tap(data => {
        if(this.selectedDivision != 0 && this.selectedConference != 0)
        this.selectedConference = this.conferences.indexOf(data[0].conference) + 1;
      }),
      tap(data => this.allTeams = data)
    );
  }

  trackTeam(teamId: string): void {
    let team = this.allTeams.find(team => team.id == Number(teamId));
    if (team)
      this.nbaService.addTrackedTeam(team);
  }
}
