import { Component, inject } from '@angular/core';
import { GameService } from '../../core/service/games.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  private gameService = inject(GameService);

  getGame(){
    this.gameService.getGames();

  }

}
