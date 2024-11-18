import {createComponentFactory, Spectator, SpyObject} from '@ngneat/spectator/jest';
import { GameComponent } from './game.component';
import { GamesService, Player, PlayersService } from '../../core/api';
import { Router } from '@angular/router';
import spyOn = jest.spyOn;
import {of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('GameComponent', () => {
  let spectator: Spectator<GameComponent>;
  let mockPlayerService: SpyObject<PlayersService>;
  let mockGameService: SpyObject<GamesService>;

  const listPlayers : Player[] = [
    {
        "id": 1,
        "name": "player 1"
    },
    {
        "id": 2,
        "name": "player 2"
    },
    {
        "id": 3,
        "name": "player 3"
    }
  ]

  const error: ErrorEvent = new ErrorEvent('error');
  const httpErrorResponse : HttpErrorResponse = new HttpErrorResponse({
    error: error,
    status: 401,
    statusText: 'error Message'
  });

  const createComponent = createComponentFactory({
    component: GameComponent,
    mocks : [Router,PlayersService,GamesService],
    detectChanges: false,
    shallow: true
  });

  beforeEach(() => {
    spectator = createComponent();
    mockPlayerService = spectator.inject(PlayersService);
    spyOn(mockPlayerService, 'playersGet').mockImplementation(() => of(listPlayers as any));
  });

  afterEach(()=>{
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should fetch all players on initialization', () => {
    const callPlayersGet = spyOn(mockPlayerService, 'playersGet').mockImplementation(() => of(listPlayers as any));
    spectator.detectChanges();

    expect(callPlayersGet).toHaveBeenCalled();
    expect(spectator.component.allPlayers).toEqual(listPlayers);
  });

  it('should add a new player', () => {
    const callPlayersPost = spyOn(mockPlayerService, 'playersPost').mockReturnValue(of({ status: 201 } as any));

    spectator.component.name = 'New Player';
    spectator.component.newPlayer();

    expect(callPlayersPost).toHaveBeenCalledWith({ name: 'New Player' }, 'response');
    expect(spectator.component.creationLoading).toBe(false);
  });

  it('should handle duplicate player names', () => {
    const consoleSpy = spyOn(console, 'warn');
    spyOn(mockPlayerService, 'playersPost').mockReturnValue(of({ status: 200 } as any));

    spectator.component.name = 'Duplicate Name';
    spectator.component.newPlayer();
    spectator.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith('Ce nom de joueur existe déjà');
    expect(spectator.component.name).toBe('');
    expect(spectator.component.creationLoading).toBe(false);
  });

  it('should handle errors when adding new player', () => {
    const consoleSpy = spyOn(console, 'error');
    spyOn(mockPlayerService, 'playersPost').mockImplementation(() => throwError(() => httpErrorResponse));

    spectator.component.name = 'Duplicate Name';
    spectator.component.newPlayer();
    spectator.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith("Le joueur n'a pas pu être ajouté");
  });

  it('should start a new game with selected players', () => {
    spectator.component.playersControl.setValue([{ id: 1, name: 'Player 1' }, { id: 2, name: 'Player 2' }]);
    spectator.component.newGame();

    expect(spectator.component.showSelection).toBe(false);
    expect(spectator.component.player1).toEqual({ id: 1, name: 'Player 1' });
    expect(spectator.component.player2).toEqual({ id: 2, name: 'Player 2' });
    expect(spectator.component.cardGame).toBeTruthy();
  });

  it('should flip the right card', () => {
    spectator.component.cardGame = {
      scorePlayer1: 10,
      scorePlayer2: 5,
      playCard: jest.fn(),
      playRound: jest.fn(),
      playersStillGotCard: jest.fn(() => true),
    } as any;
    spectator.component.currentPlayer= 1;
    spectator.component.flipCard();
    expect(spectator.component.cardGame?.playCard).toHaveBeenCalledWith(1);
  });

  it('should end the game if there is no more cards', () => {
    mockGameService = spectator.inject(GamesService);
    spectator.component.cardGame = {
      scorePlayer1: 10,
      scorePlayer2: 5,
      playCard: jest.fn(),
      playRound: jest.fn(),
      playersStillGotCard: jest.fn(() => false),
    } as any;
    spectator.component.player1 = { id: 1, name: 'Player 1' };
    spectator.component.player2 = { id: 2, name: 'Player 2' };
    const callGamePost = spyOn(mockGameService,"gamesPost").mockReturnValue(of({ status: 201 } as any));

    spectator.component.currentPlayer= 2;
    spectator.component.flipCard();
    expect(spectator.component.cardGame?.playCard).toHaveBeenCalledWith(2);
    expect(spectator.component.currentPlayer).toEqual(0);
    expect(callGamePost).toHaveBeenCalledWith(
      [
        { playerId: 1, score: 10 },
        { playerId: 2, score: 5 },
      ],
      'response'
    );
    expect(spectator.component.winner).toBe('Player 1');
  });
});
