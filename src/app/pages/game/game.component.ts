import { Component, inject, OnInit } from '@angular/core';
import { GamesService, Player, PlayerPayload, PlayersService, Score } from '../../core/api';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CardGame } from '../../model/cardGame';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule, FormsModule, MatIconModule, MatFormFieldModule,MatListModule, MatProgressSpinnerModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit{

  private playersService = inject(PlayersService);
  private gamesService = inject(GamesService);
  private router = inject(Router);
  allPlayers: Player[] = [];
  form: FormGroup;
  playersControl = new FormControl();
  name: string = '';
  winner: string | undefined;
  player1: Player | undefined;
  player2: Player | undefined;
  creationLoading : boolean = true;
  playersLoading : boolean = true;
  showSelection : boolean = true;
  nameAlreadyExist: boolean = false;
  cardGame : CardGame | undefined;
  currentPlayer : number = 1 ;
    
  constructor() {
    this.form = new FormGroup({
      players: this.playersControl,
    });
  }

  ngOnInit(): void {
    this.getAllPlayers();
  }

  newPlayer(): void {
    this.creationLoading = true;
    const playload : PlayerPayload = {
      name : this.name
    }
    this.playersService.playersPost(playload,'response').subscribe({
      next : (result) => {
        if(result.status == 200){
          console.warn("Ce nom de joueur existe déjà");
          //TODO -> renvoyer un message a l'utilisateur
        }else{
          this.getAllPlayers();
        }
      },
      error : (e) => {
        console.error("Le joueur n'a pas pu être ajouté ",e);
      },
      complete : () => {
        this.name='';
        this.creationLoading = false;
      }
    })
  }

  getAllPlayers() : void {
    this.playersLoading = true ;
    this.playersService.playersGet().subscribe({
      next : (players : Player[]) => {
        this.allPlayers=players;
      },
      error : (e) => {
        console.error("La récupération des joueurs a échoué ",e);
      },
      complete : () => {
        this.playersLoading = false;
        this.creationLoading = false;
      }
    })
  }

  newGame(): void {
    this.showSelection=false;
    this.player1 = this.playersControl.value[0];
    this.player2 = this.playersControl.value[1];
    this.cardGame = new CardGame();
  }

  flipCard(){
    if(this.currentPlayer==1){
      this.cardGame?.playCard(1);
      this.currentPlayer = 2;
    }else{
      //it's the 2nd player turn so we flip the card ...
      this.cardGame?.playCard(2);
      //... and we play the round 
      this.cardGame?.playRound();
      this.currentPlayer = this.cardGame?.playersStillGotCard() ? 1 : 0;
      //if we have no more cards to play we can end the game
      if(this.currentPlayer==0){
        this.endGame();
      }
    }
  }

  endGame(): void {
    if(this.cardGame && this.cardGame?.scorePlayer1 >this.cardGame?.scorePlayer2){
      this.winner=this.player1?.name;
    }else if (this.cardGame && this.cardGame?.scorePlayer1 < this.cardGame?.scorePlayer2){
      this.winner=this.player2?.name;
    } else{
      this.winner = undefined;
    }
    const scoreP1 : Score = {playerId : this.player1?.id, score : this.cardGame?.scorePlayer1};
    const scoreP2 : Score = {playerId : this.player2?.id, score : this.cardGame?.scorePlayer2};
    this.gamesService.gamesPost([scoreP1,scoreP2],'response').subscribe({
      next : (result) => {
      }
    })
  }

  goToHomePage() : void {
    this.router.navigateByUrl('jeu-bataille/home');
  }

}
