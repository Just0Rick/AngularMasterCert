import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {concat, concatAll, forkJoin, map, mergeAll, Observable, shareReplay, zip} from 'rxjs';
import { format, subDays } from 'date-fns';
import {Game, Stats, Team} from './data.models';
import { DialogService } from './dialog.service';
import { AppComponent } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class NbaService {

  private headers = {'X-RapidAPI-Key': '2QMXSehDLSmshDmRQcKUIAiQjIZAp1UvKUrjsnewgqSP6F5oBX',
    'X-RapidAPI-Host': 'free-nba.p.rapidapi.com'};
  private API_URL = "https://free-nba.p.rapidapi.com";
  trackedTeams: Team[] = [];

  constructor(private http: HttpClient, private dialogService: DialogService) { }

  addTrackedTeam(team: Team): void {
    this.trackedTeams.push(team);
  }

  removeTrackedTeam(team: Team): void {
    this.dialogService.setActions(AppComponent.DIALOG_NAME,[
      {
        text: 'No',
        buttonStyle: 'default',
        delegate: (reference) => reference.closeDialog()
      },
      {
        text: 'Yes',
        buttonStyle: 'secondary',
        delegate: (reference) => {
          let index = this.trackedTeams.findIndex(t => t.id == team.id);
          this.trackedTeams.splice(index, 1);
          reference.closeDialog();
        }
      }
    ]);
    this.dialogService.openDialog(AppComponent.DIALOG_NAME);
  }

  getTrackedTeams(): Team[] {
    return this.trackedTeams;
  }

  getAllTeamsPerPage(pageNumber: number = 0): Observable<Team[]> {
    return this.http.get<{data: Team[]}>(`${this.API_URL}/teams?page=${pageNumber}`,
      {headers: this.headers}).pipe(
      map(res => res.data),
      shareReplay(1, 3000)
    );
  }

  getAllTeams(singlePage: boolean = true): Observable<Team[]>{
    let firstPage$ = this.getAllTeamsPerPage(1);
    if(singlePage) return firstPage$;
    let secondPage$ = this.getAllTeamsPerPage(2);
    return forkJoin(firstPage$, secondPage$).pipe(
      map(([first, second]) => [...first, ...second])
    );
    
  }

  getLastResults(team: Team, numberOfDays = 12 ): Observable<Game[]> {
    return this.http.get<{meta: any, data: Game[]}>(`${this.API_URL}/games?page=0${this.getDaysQueryString(numberOfDays)}`,
      {headers: this.headers, params: {per_page: 12, "team_ids[]": ""+team.id}}).pipe(
        map(res => res.data.sort( (a, b) => a.id - b.id)),
        shareReplay(1, 3000)
    );
  }

  getStatsFromGames(games: Game[], team: Team): Stats {
        const stats: Stats = {wins: 0, losses: 0, averagePointsScored: 0, averagePointsConceded: 0, lastGames: []};
        games.forEach(game => {
            const gameStats = this.getSingleGameStats(team, game);
            stats.wins += gameStats.wins;
            stats.losses += gameStats.losses;
            stats.averagePointsConceded += gameStats.averagePointsConceded;
            stats.averagePointsScored += gameStats.averagePointsScored;
          stats.lastGames.push(gameStats.wins == 1 ? 'W' : 'L');
        });
        stats.averagePointsScored = Math.round(stats.averagePointsScored / games.length);
        stats.averagePointsConceded = Math.round(stats.averagePointsConceded / games.length);
        return stats;
  }

  private getDaysQueryString(nbOfDays = 12): string {
    let qs = "";
    for (let i = 1;i < nbOfDays; i++) {
      let date = format(subDays(new Date(), i), "yyyy-MM-dd")
      qs = qs.concat("&dates[]=" + date);
    }
    return qs;
  }

  private getSingleGameStats(team: Team, game: Game): Stats {
    const stats: Stats = {wins: 0, losses: 0, averagePointsScored: 0, averagePointsConceded: 0, lastGames: []};
    if (game.home_team.id === team.id) {
      stats.averagePointsScored = game.home_team_score;
      stats.averagePointsConceded = game.visitor_team_score;
    }
    else if (game.visitor_team.id === team.id) {
      stats.averagePointsScored = game.visitor_team_score;
      stats.averagePointsConceded = game.home_team_score;
    }
    if(stats.averagePointsScored > stats.averagePointsConceded) stats.wins = 1;
    else stats.losses = 1;

    return stats;
  }
}
