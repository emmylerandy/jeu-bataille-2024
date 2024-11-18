import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GamesService } from '../api/api/games.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private httpService :  HttpClient, private game : GamesService) { }

  productData : any;
  

  getGames(): void  {
    this.game.gamesGet().subscribe(res=>{
      this.productData = res;
    });

  }


}
