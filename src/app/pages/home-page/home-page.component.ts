import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list'
import { GamesService } from '../../core/api/api/games.service';
import { Game } from '../../core/api/model/game';
import { Player, PlayersService } from '../../core/api';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

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
  
  //[TODO]
  //ajouter un type gamesWithPlayer
  //ajouter Gagnant pour pouvoir l'afficher différemment
  allGamesWithPlayers: any[] = [];

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
            player1: game.scores ? playersMap.get(game.scores[0].playerId) : null,
            player2: game.scores ? playersMap.get(game.scores[1].playerId) : null
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
