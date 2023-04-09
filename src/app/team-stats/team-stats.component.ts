import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {NbaService} from '../nba.service';
import {Game, Stats, Team} from '../data.models';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../dialog.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.css']
})
export class TeamStatsComponent implements OnInit, OnChanges {

  @Input()
  team!: Team;

  @Input()
  daysTracked: number = 12;

  games$!: Observable<Game[]>;
  stats!: Stats;
  constructor(
    protected nbaService: NbaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService) { }

  updateGameResults(){
    this.games$ = this.nbaService.getLastResults(this.team, this.daysTracked).pipe(
      tap(games =>  this.stats = this.nbaService.getStatsFromGames(games, this.team))
    )
  }

  ngOnInit(): void {
    this.updateGameResults();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateGameResults();
  }

  showResults(teamAbbr: string){
    this.router.navigate(['results', teamAbbr, this.daysTracked], { relativeTo: this.activatedRoute });
  }

  onDeleteAttempt(team: Team){
    this.dialogService.openDialog(AppComponent.DIALOG_NAME, team);
  }
}
