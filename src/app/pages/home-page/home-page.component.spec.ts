
import { HomePageComponent } from './home-page.component';
import { createComponentFactory, Spectator, SpyObject } from '@ngneat/spectator/jest';
import { Game, GamesService, Player, PlayersService } from '../../core/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import spyOn = jest.spyOn;
import {of, throwError } from 'rxjs';

describe('HomePageComponent', () => {
  let spectator: Spectator<HomePageComponent>;
  let mockPlayerService: SpyObject<PlayersService>;
  let mockGameService: SpyObject<GamesService>;
  let mockRouter: SpyObject<Router>;

  const listPlayers : Player[] = [
    {
        "id": 1,
        "name": "player 1"
    },
    {
        "id": 2,
        "name": "player 2"
    },
  ]
  const listGames : Game[] = [
      {
          "id": 1,
          "scores": [
              {
                  "playerId": 1,
                  "score": 10
              },
              {
                  "playerId": 2,
                  "score": 20
              }
          ]
      },
      {
          "id": 2,
          "scores": [
              {
                  "playerId": 1,
                  "score": 15
              },
              {
                  "playerId": 2,
                  "score": 5
              }
          ]
      },
      {
          "id": 3,
          "scores": [
              {
                  "playerId": 1,
                  "score": 20
              },
              {
                  "playerId": 2,
                  "score": 0
              }
          ]
      },
  ]

  const error: ErrorEvent = new ErrorEvent('error');
  const httpErrorResponse : HttpErrorResponse = new HttpErrorResponse({
    error: error,
    status: 401,
    statusText: 'error Message'
  });

  const createComponent = createComponentFactory({
    component: HomePageComponent,
    mocks : [Router,PlayersService,GamesService],
    detectChanges: false,
    shallow: true
  });

  beforeEach(() => {
    spectator = createComponent();
    mockPlayerService = spectator.inject(PlayersService);
    spyOn(mockPlayerService, 'playersGet').mockImplementation(() => of(listPlayers as any));
    mockGameService = spectator.inject(GamesService);
    spyOn(mockGameService, 'gamesGet').mockImplementation(() => of(listGames as any))
  });

  afterEach(()=>{
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should load correctly the Games with the associate players', () =>{
    spectator.detectChanges();
    const expectedGames :any[] = [
      {
        id: 1,
        scores: [ {
          "playerId": 1,
          "score": 10
      },
      {
          "playerId": 2,
          "score": 20
      } ],
        player1: { id: 1, name: 'player 1' },
        player2: { id: 2, name: 'player 2' }
      },
      {
        id: 2,
        scores: [ 
              {
                  "playerId": 1,
                  "score": 15
              },
              {
                  "playerId": 2,
                  "score": 5
              }
          ],
        player1: { id: 1, name: 'player 1' },
        player2: { id: 2, name: 'player 2' }
      },
      {
        id: 3,
        scores: [
          {
              "playerId": 1,
              "score": 20
          },
          {
              "playerId": 2,
              "score": 0
          }
        ],
        player1: { id: 1, name: 'player 1' },
        player2: { id: 2, name: 'player 2' }
      }
    ];
    expect(spectator.component.allGamesWithPlayers).toEqual(expectedGames);
  });

  it('should navigate to /game ', () => {
    mockRouter = spectator.inject(Router);
    const callNavigate = spyOn(mockRouter,"navigateByUrl");
    spectator.detectChanges();
    spectator.component.startGame();
    expect(callNavigate).toHaveBeenCalledWith('jeu-bataille/game');
  });

});
