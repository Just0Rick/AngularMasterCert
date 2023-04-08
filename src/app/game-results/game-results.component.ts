import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NbaService} from '../nba.service';
import {Game, Team} from '../data.models';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-game-results',
  templateUrl: './game-results.component.html',
  styleUrls: ['./game-results.component.css']
})
export class GameResultsComponent {

  team?: Team;
  daysTracked?: number;
  games$?: Observable<Game[]>;

  constructor(private activatedRoute: ActivatedRoute, private nbaService: NbaService, private router: Router) {
    this.activatedRoute.paramMap.subscribe(paramMap => {
        this.team = this.nbaService.getTrackedTeams().find(team => team.abbreviation === paramMap.get("teamAbbr"));
        this.daysTracked = Number(paramMap.get("daysTracked") || 12);
        if (this.team){
          this.games$ = this.nbaService.getLastResults(this.team, this.daysTracked);
        }
    })
  }

}
