import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list'
import { GamesService } from '../../core/api/api/games.service';
import { Game } from '../../core/api/model/game';
import { Player, PlayersService } from '../../core/api';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [MatButtonModule, MatListModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',

})
export class HomePageComponent implements OnInit {
  private gamesService = inject(GamesService);
  private playersService =inject(PlayersService);

  allGames : Game[] =[];
  allPlayers : Player[]= [];
  gamesWithPlayers: any[] = [];

  ngOnInit(): void {
    /*this.gamesService.gamesGet().subscribe(res=>{
      this.allGames = res;
      console.log(this.allGames)
    });
    this.playersService.playersGet().subscribe(res=>{
      this.allPlayers = res;
      console.log(this.allPlayers)
    });*/
    this.loadGamesAndPlayers();

    
    
  }
  
  loadGamesAndPlayers() : void {
    forkJoin([
      this.gamesService.gamesGet(), 
      this.playersService.playersGet()
    ]).subscribe(
      {
        next: ([games, players]) => {
          const playersMap = new Map(players.map(player => [player.id, player]));
          this.gamesWithPlayers = games.map(game => ({
            ...game, 
            player1: game.scores ? playersMap.get(game.scores[0].playerId) : null,
            player2: game.scores ? playersMap.get(game.scores[1].playerId) : null
          }));
          console.log(this.gamesWithPlayers);
        },
        error: (e) =>{
          console.error('Erreur lors de la récupération des données :', e);
        },
        
      }
    )
      
  }
}
