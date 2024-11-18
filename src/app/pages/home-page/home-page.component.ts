import { Component, inject, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list'
import { GamesService } from '../../core/api/api/games.service';
import { Player, PlayersService, Score } from '../../core/api';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

type GameWithPlayers = {
  id?: number,
  scores?: Score[],
  player1?: Player,
  player2?: Player
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [MatButtonModule, MatListModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',

})
export class HomePageComponent implements OnInit {
  private gamesService = inject(GamesService);
  private playersService = inject(PlayersService);
  private router = inject(Router);

  allGamesWithPlayers: GameWithPlayers[] = [];

  ngOnInit(): void {
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
          this.allGamesWithPlayers = games.map(game => ({
            ...game, 
            player1: game.scores ? playersMap.get(game.scores[0].playerId) : undefined,
            player2: game.scores ? playersMap.get(game.scores[1].playerId) : undefined
          }));
        },
        error: (e) =>{
          console.error('Erreur lors de la récupération des données :', e);
        },
        
      }
    )   
  }

  startGame() : void {
    this.router.navigateByUrl('jeu-bataille/game');
  }
}
